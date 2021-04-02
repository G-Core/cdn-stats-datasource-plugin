import defaults from "lodash/defaults";
import React, { ChangeEvent, PureComponent } from "react";
import { LegacyForms } from "@grafana/ui";
import { QueryEditorProps, SelectableValue } from "@grafana/data";
import { DataSource } from "../datasource";
import {
  GCDataSourceOptions,
  GCGranularity,
  GCGrouping,
  GCQuery,
  GCMetric,
} from "../types";
import { GCSelectMetric } from "./GCSelectMetric";
import { GCSelectGranularity } from "./GCSelectGranularity";
import { GCSelectGrouping } from "./GCSelectGrouping";
import { GCInput } from "./GCInput";
import { defaultQuery } from "../defaults";

const { FormField } = LegacyForms;

type Props = QueryEditorProps<DataSource, GCQuery, GCDataSourceOptions>;

export class GCQueryEditor extends PureComponent<Props> {
  onMetricChange = (value: SelectableValue<GCMetric>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, metric: value });
    onRunQuery();
  };

  onGroupingChange = (value: Array<SelectableValue<GCGrouping>>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, grouping: value });
    onRunQuery();
  };

  onGranularityChange = (value: SelectableValue<GCGranularity>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, granularity: value });
    onRunQuery();
  };

  onVhostsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, vhosts: event.target.value });
    onRunQuery();
  };

  onResourcesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, resources: event.target.value });
    onRunQuery();
  };

  onClientsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, clients: event.target.value });
    onRunQuery();
  };

  onRegionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, regions: event.target.value });
    onRunQuery();
  };

  onCountryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, countries: event.target.value });
    onRunQuery();
  };

  onLegendFormatChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, legendFormat: event.target.value });
    onRunQuery();
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const {
      metric,
      legendFormat,
      grouping,
      countries,
      granularity,
      regions,
      vhosts,
      resources,
      clients,
    } = query;

    return (
      <>
        <div>
          <div className="section" style={{ marginRight: "27px" }}>
            <label className="gf-form-group-label">Query Props</label>
            <div className="gf-form">
              <FormField
                label="Metric"
                inputEl={
                  <GCSelectMetric
                    width={20}
                    isSearchable
                    maxVisibleValues={20}
                    minMenuHeight={45}
                    menuPlacement={"bottom"}
                    onChange={this.onMetricChange}
                    value={metric}
                  />
                }
              />
            </div>

            <div className="gf-form">
              <FormField
                label="Granularity"
                tooltip="Time series granularity"
                inputEl={
                  <GCSelectGranularity
                    width={20}
                    maxVisibleValues={4}
                    minMenuHeight={25}
                    menuPlacement={"bottom"}
                    onChange={this.onGranularityChange}
                    value={granularity}
                  />
                }
              />
            </div>

            <div className="gf-form">
              <FormField
                label="Group By"
                tooltip="Fields used for grouping"
                inputEl={
                  <GCSelectGrouping
                    width={20}
                    isSearchable
                    maxVisibleValues={20}
                    minMenuHeight={35}
                    menuPlacement={"bottom"}
                    onChange={this.onGroupingChange}
                    value={grouping}
                  />
                }
              />
            </div>
          </div>

          <div className="section" style={{ marginRight: "27px" }}>
            <label className="gf-form-group-label">
              Filters (comma separated)
            </label>

            <div className="gf-form">
              <GCInput
                width={8}
                value={vhosts}
                onChange={this.onVhostsChange}
                label="Vhosts"
                tooltip="Filter by vhost"
                type="text"
              />
            </div>
            <div className="gf-form">
              <GCInput
                width={8}
                value={resources}
                onChange={this.onResourcesChange}
                label="Resources"
                tooltip="Filter by resource id"
                type="text"
              />
            </div>
            <div className="gf-form">
              <GCInput
                width={8}
                value={clients}
                onChange={this.onClientsChange}
                label="Clients"
                tooltip="Filter by client id"
                type="text"
              />
            </div>
            <div className="gf-form">
              <GCInput
                width={8}
                value={regions}
                onChange={this.onRegionChange}
                label="Regions"
                tooltip="Filter by region"
                type="text"
              />
            </div>
            <div className="gf-form">
              <GCInput
                width={8}
                value={countries}
                onChange={this.onCountryChange}
                label="Countries"
                tooltip="Filter by country"
                type="text"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="gf-form">
            <GCInput
              inputWidth={30}
              value={legendFormat}
              onChange={this.onLegendFormatChange}
              label="Legend"
              placeholder="legend format"
              tooltip="Controls the name of the time series, using name or pattern. For example {{resource}} will be replaced with label value for the label resource."
              type="text"
            />
          </div>
        </div>
      </>
    );
  }
}
