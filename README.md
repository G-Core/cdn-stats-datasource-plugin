# Grafana Data Source Plugin for EdgeCenter CDN metrics

[![Build](https://github.com/Edge-Center/cdn-stats-datasource-plugin/actions/workflows/ci.yml/badge.svg)](https://github.com/Edge-Center/cdn-stats-datasource-plugin/actions/workflows/ci.yml)

This is a Grafana datasource plugin for EdgeCenter statistics.

## What is EdgeCenter Grafana Data Source Plugin?

Grafana supports a wide range of data sources, including Prometheus, MySQL, and even Datadog. There’s a good chance you can already visualize metrics from the systems you have set up.

In our case this datasource plugin is backed by EdgeCenter CDN statistics API.

## Key Features

- Visualizing data from cdn stats api
- Utilize resource and client ids filters (cnames comming soon)
- Utilize groupings
- Utilize variables

## Example data source Config File
If you are running multiple instances of Grafana you might run into problems if they have different versions of the datasource.yaml configuration file.
The best way to solve this problem is to add a version number to each datasource in the configuration and increase it when you update the config.
Grafana will only update datasources with the same or lower version number than specified in the config. That way, old configs cannot overwrite newer configs if they restart at the same time.

```yaml
apiVersion: 1

datasources:
  - name: cdn-stats
    orgId: 1
    editable: true
    access: proxy
    type: ec-cdn-stats-datasource
    isDefault: true
    version: 1
    jsonData:
      apiUrl: api.edgecenter.ru
    secureJsonData:
      apiKey: 'APIKey ...'
```

## Samples

### Total bytes by resources

![total_bytes_by_resources](https://github.com/Edge-Center/cdn-stats-datasource-plugin/blob/master/screenshots/total_bytes_by_resources.png?raw=true)

