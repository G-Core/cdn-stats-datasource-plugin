# Grafana Data Source Plugin for Gcore CDN metrics

[![Build](https://github.com/G-Core/cdn-stats-datasource-plugin/actions/workflows/ci.yml/badge.svg)](https://github.com/G-Core/cdn-stats-datasource-plugin/actions/workflows/ci.yml)

This is a Grafana datasource plugin for Gcore cdn statistics.

## What is Grafana Data Source Plugin?

Grafana supports a wide range of data sources, including Prometheus, MySQL, and even Datadog. There’s a good chance you can already visualize metrics from the systems you have set up. In some cases, though, you already have an in-house metrics solution that you’d like to add to your Grafana dashboards. Grafana Data Source Plugins enables integrating such solutions with Grafana.

In our case this datasource plagin is backed by Gcore cdn statistics API.

## Samples

### Total bytes by resources

![total_bytes_by_resources](https://github.com/G-Core/cdn-stats-datasource-plugin/blob/master/screenshots/total_bytes_by_resources.png?raw=true)

## Getting started (dev)

1. Install dependencies

   ```bash
   yarn install
   ```

2. Build plugin in development mode or run in watch mode

   ```bash
   yarn dev
   ```

   or

   ```bash
   yarn watch
   ```

3. Build plugin in production mode

   ```bash
   yarn build
   ```

## Learn more

- [Build a data source plugin tutorial](https://grafana.com/tutorials/build-a-data-source-plugin)
- [Grafana documentation](https://grafana.com/docs/)
- [Grafana Tutorials](https://grafana.com/tutorials/) - Grafana Tutorials are step-by-step guides that help you make the most of Grafana
- [Grafana UI Library](https://developers.grafana.com/ui) - UI components to help you build interfaces using Grafana Design System
