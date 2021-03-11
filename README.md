# Grafana Data Source Plugin for Gcore CDN metrics

[![Build](https://github.com/G-Core/cdn-stats-datasource-plugin/actions/workflows/ci.yml/badge.svg)](https://github.com/G-Core/cdn-stats-datasource-plugin/actions/workflows/ci.yml)

This is a Grafana datasource plugin for Gcore cdn statistics.

## What is Gcore Grafana Data Source Plugin?

Grafana supports a wide range of data sources, including Prometheus, MySQL, and even Datadog. There’s a good chance you can already visualize metrics from the systems you have set up. In some cases, though, you already have an in-house metrics solution that you’d like to add to your Grafana dashboards. Grafana Data Source Plugins enables integrating such solutions with Grafana.

In our case this datasource plagin is backed by Gcore cdn statistics API.

## Samples

### Total bytes by resources

![total_bytes_by_resources](https://github.com/G-Core/cdn-stats-datasource-plugin/blob/master/screenshots/total_bytes_by_resources.png?raw=true)

## Key Features

- Visualizing data from cdn stats api
- Utilize resource and client ids filters (cnames comming soon)
- Utilize groupings
- Utilize variables
