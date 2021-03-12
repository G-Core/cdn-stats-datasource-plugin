# Grafana Data Source Plugin for Gcore CDN metrics

[![Build](https://github.com/G-Core/cdn-stats-datasource-plugin/actions/workflows/ci.yml/badge.svg)](https://github.com/G-Core/cdn-stats-datasource-plugin/actions/workflows/ci.yml)

This is a Grafana datasource plugin for G-Core Labs statistics.

## What is Gcore Grafana Data Source Plugin?

Grafana supports a wide range of data sources, including Prometheus, MySQL, and even Datadog. There’s a good chance you can already visualize metrics from the systems you have set up.

In our case this datasource plugin is backed by Gcore CDN statistics API.

## Key Features

- Visualizing data from cdn stats api
- Utilize resource and client ids filters (cnames comming soon)
- Utilize groupings
- Utilize variables

## Samples

### Total bytes by resources

![total_bytes_by_resources](https://github.com/G-Core/cdn-stats-datasource-plugin/blob/master/screenshots/total_bytes_by_resources.png?raw=true)

