package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/datasource"
	"github.com/grafana/grafana-plugin-sdk-go/backend/instancemgmt"
)

func main() {
	if err := datasource.Manage("gcorelabs-cdn-stats-datasource", newDatasourceFactory(), datasource.ManageOpts{}); err != nil {
		fmt.Fprintf(os.Stderr, "Failed to start datasource: %v\n", err)
		os.Exit(1)
	}
}

func newDatasourceFactory() datasource.InstanceFactoryFunc {
	return func(ctx context.Context, settings backend.DataSourceInstanceSettings) (instancemgmt.Instance, error) {
		var jsonData map[string]interface{}
		if err := json.Unmarshal(settings.JSONData, &jsonData); err != nil {
			jsonData = make(map[string]interface{})
		}

		url, _ := jsonData["apiUrl"].(string)
		if url == "" {
			url = "https://api.gcore.com/cdn"
		}

		apiKey := ""
		if settings.DecryptedSecureJSONData != nil {
			apiKey = settings.DecryptedSecureJSONData["apiKey"]
		}

		return NewDataSource(url, apiKey), nil
	}
}
