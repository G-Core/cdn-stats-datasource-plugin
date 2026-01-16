package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
)

func buildStatsRequest(query backend.DataQuery) (*StatsRequest, error) {
	if len(query.JSON) == 0 {
		return nil, fmt.Errorf("query JSON is empty")
	}

	var qm QueryModel
	if err := json.Unmarshal(query.JSON, &qm); err != nil {
		return nil, err
	}

	if qm.Metric.Value == "" {
		return nil, fmt.Errorf("no metric selected")
	}

	return &StatsRequest{
		Metrics:     []string{qm.Metric.Value},
		Granularity: qm.Granularity.Value,
		From:        query.TimeRange.From.UTC().Format(time.RFC3339),
		To:          query.TimeRange.To.UTC().Format(time.RFC3339),
		Vhosts:      parseStrings(qm.Vhosts),
		Resources:   parseInts(qm.Resources),
		Countries:   parseStrings(qm.Countries),
		Regions:     parseStrings(qm.Regions),
		Clients:     parseInts(qm.Clients),
		GroupBy:     extractGrouping(qm.Grouping),
		Flat:        true,
	}, nil
}

func extractGrouping(values []SelectableValue) []string {
	var out []string
	for _, v := range values {
		if v.Value != "" {
			out = append(out, v.Value)
		}
	}
	return out
}

func parseInts(s string) []int64 {
	var out []int64
	for _, p := range strings.Split(s, ",") {
		if v, err := strconv.ParseInt(strings.TrimSpace(p), 10, 64); err == nil {
			out = append(out, v)
		}
	}
	return out
}

func parseStrings(s string) []string {
	var out []string
	for _, p := range strings.Split(s, ",") {
		if v := strings.TrimSpace(p); v != "" {
			out = append(out, v)
		}
	}
	return out
}
