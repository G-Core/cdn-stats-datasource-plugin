package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
	"unicode"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/data"
)

type GCDataSource struct {
	URL    string
	APIKey string
	Client *http.Client
}

type IAMUser struct {
	Name string `json:"name"`
}

func NewDataSource(url, apiKey string) *GCDataSource {
	if !strings.HasPrefix(url, "http://") && !strings.HasPrefix(url, "https://") {
		url = "https://" + url
	}
	url = strings.TrimSuffix(url, "/")

	return &GCDataSource{
		URL:    url,
		APIKey: apiKey,
		Client: &http.Client{Timeout: 30 * time.Second},
	}
}

func (ds *GCDataSource) setHeaders(req *http.Request) {
	req.Header.Set("Content-Type", "application/json")
	if ds.APIKey != "" {
		if strings.HasPrefix(ds.APIKey, "APIKey ") || strings.HasPrefix(ds.APIKey, "Bearer ") {
			req.Header.Set("Authorization", ds.APIKey)
		} else {
			req.Header.Set("Authorization", "APIKey "+ds.APIKey)
		}
	}
}

func (ds *GCDataSource) QueryData(ctx context.Context, req *backend.QueryDataRequest) (*backend.QueryDataResponse, error) {
	resp := backend.NewQueryDataResponse()
	for _, q := range req.Queries {
		resp.Responses[q.RefID] = ds.query(ctx, q)
	}
	return resp, nil
}

func (ds *GCDataSource) query(ctx context.Context, query backend.DataQuery) backend.DataResponse {
	response := backend.DataResponse{}

	payload, err := buildStatsRequest(query)
	if err != nil {
		response.Error = err
		return response
	}

	stats, err := ds.fetchStats(ctx, payload)
	if err != nil {
		response.Error = err
		return response
	}

	response.Frames = transformStatsToFrames(stats)
	return response
}

func (ds *GCDataSource) fetchStats(ctx context.Context, payload *StatsRequest) ([]StatsResponse, error) {
	body, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	baseURL := strings.TrimSuffix(ds.URL, "/")
	if !strings.HasSuffix(baseURL, "/cdn") {
		baseURL += "/cdn"
	}

	req, err := http.NewRequestWithContext(
		ctx,
		http.MethodPost,
		baseURL+"/statistics/aggregate/stats",
		bytes.NewBuffer(body),
	)
	if err != nil {
		return nil, err
	}

	ds.setHeaders(req)

	resp, err := ds.Client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	raw, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if err := handleAPIError(resp.StatusCode, raw); err != nil {
		return nil, err
	}

	var out []StatsResponse
	if err := json.Unmarshal(raw, &out); err != nil {
		return nil, err
	}

	return out, nil
}

func handleAPIError(statusCode int, body []byte) error {
	if statusCode == http.StatusOK {
		return nil
	}

	errorMsg := strings.TrimSpace(string(body))

	switch statusCode {
	case http.StatusBadRequest:
		return fmt.Errorf("bad request (400): %s. Please check your query parameters", errorMsg)
	case http.StatusUnauthorized:
		// Specific message for Case 1/2/3 to differentiate auth error from data error.
		return fmt.Errorf("datasource authentication error: invalid API key. Please verify your credentials in the datasource settings")
	case http.StatusForbidden:
		return fmt.Errorf("forbidden (403): access denied. You may not have permissions to access this resource")
	case http.StatusNotFound:
		return fmt.Errorf("not found (404): resource not found. Check if the URL/CDN resource exists")
	case http.StatusTooManyRequests:
		return fmt.Errorf("too many requests (429): rate limit exceeded. Please reduce query frequency")
	}

	if statusCode >= 500 {
		return fmt.Errorf("server error (%d): %s. This is an issue with the Gcore API", statusCode, errorMsg)
	}

	return fmt.Errorf("gcore api error (%d): %s", statusCode, errorMsg)
}

func (ds *GCDataSource) CheckHealth(ctx context.Context, req *backend.CheckHealthRequest) (*backend.CheckHealthResult, error) {
	rootURL := strings.TrimSuffix(ds.URL, "/cdn")
	reqHTTP, err := http.NewRequestWithContext(ctx, http.MethodGet, rootURL+"/iam/users/me", nil)
	if err != nil {
		return &backend.CheckHealthResult{Status: backend.HealthStatusError, Message: err.Error()}, nil
	}

	ds.setHeaders(reqHTTP)

	resp, err := ds.Client.Do(reqHTTP)
	if err != nil {
		return &backend.CheckHealthResult{Status: backend.HealthStatusError, Message: err.Error()}, nil
	}
	defer resp.Body.Close()

	raw, err := io.ReadAll(resp.Body)
	if err != nil {
		return &backend.CheckHealthResult{Status: backend.HealthStatusError, Message: err.Error()}, nil
	}

	if err := handleAPIError(resp.StatusCode, raw); err != nil {
		return &backend.CheckHealthResult{
			Status:  backend.HealthStatusError,
			Message: err.Error(),
		}, nil
	}

	var user IAMUser
	if err := json.Unmarshal(raw, &user); err != nil {
		return &backend.CheckHealthResult{Status: backend.HealthStatusError, Message: err.Error()}, nil
	}

	name := "Unknown"
	if user.Name != "" {
		name = user.Name
	}

	return &backend.CheckHealthResult{
		Status:  backend.HealthStatusOk,
		Message: fmt.Sprintf("Auth OK (IAM): %s", name),
	}, nil
}

func transformStatsToFrames(stats []StatsResponse) []*data.Frame {
	var frames []*data.Frame

	for _, s := range stats {
		var groups []string

		if s.Resource != nil {
			groups = append(groups, fmt.Sprintf("resource: %d", *s.Resource))
		}
		if s.Client != nil {
			groups = append(groups, fmt.Sprintf("client: %d", *s.Client))
		}
		if s.Region != "" {
			groups = append(groups, fmt.Sprintf("region: %s", s.Region))
		}
		if s.Vhost != "" {
			groups = append(groups, fmt.Sprintf("vhost: %s", s.Vhost))
		}
		if s.Country != "" {
			groups = append(groups, fmt.Sprintf("country: %s", s.Country))
		}
		if s.DC != "" {
			groups = append(groups, fmt.Sprintf("dc: %s", s.DC))
		}

		suffix := ""
		if len(groups) > 0 {
			suffix = " (" + strings.Join(groups, ", ") + ")"
		}

		for metric, points := range s.Metrics {
			name := formatMetricName(metric) + suffix

			unit := "decbytes"
			lm := strings.ToLower(metric)
			if strings.Contains(lm, "bandwidth") {
				unit = "bps"
			} else if strings.Contains(lm, "requests") || strings.Contains(lm, "responses") {
				unit = "short"
			}

			valueField := data.NewField("value", nil, []float64{})
			valueField.SetConfig(&data.FieldConfig{
				DisplayName: name,
				Unit:        unit,
			})

			frame := data.NewFrame(
				name,
				data.NewField("time", nil, []time.Time{}),
				valueField,
			)

			frame.SetMeta(&data.FrameMeta{Type: "timeseries"})

			for _, p := range points {
				if len(p) == 2 {
					frame.AppendRow(time.Unix(int64(p[0]), 0), p[1])
				}
			}

			frames = append(frames, frame)
		}
	}

	return frames
}

func formatMetricName(input string) string {
	s := strings.ReplaceAll(input, "_", " ")
	words := strings.Fields(s)
	for i, w := range words {
		r := []rune(w)
		r[0] = unicode.ToUpper(r[0])
		words[i] = string(r)
	}
	return strings.Join(words, " ")
}
