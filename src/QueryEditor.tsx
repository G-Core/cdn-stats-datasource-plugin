import defaults from 'lodash/defaults';

import React, {
  // ChangeEvent,
  ChangeEvent,
  PureComponent,
} from 'react';
import { LegacyForms, Select, MultiSelect } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from './datasource';
import { defaultQuery, MyDataSourceOptions, MyQuery } from './types';

const { FormField } = LegacyForms;

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  onMetricChange = (value: SelectableValue<any>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, metric: value });
    // executes the query
    onRunQuery();
  };

  onGroupingChange = (value: Array<SelectableValue<any>>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, grouping: value });
    // executes the query
    onRunQuery();
  };

  onGranularityChange = (value: SelectableValue<any>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, granularity: value });
    // executes the query
    onRunQuery();
  };

  onVhostsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, vhosts: event.target.value });
    // executes the query
    onRunQuery();
  };

  onResourcesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, resources: event.target.value });
    // executes the query
    onRunQuery();
  };

  onClientsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, clients: event.target.value });
    // executes the query
    onRunQuery();
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { metric, grouping, granularity, vhosts, resources, clients } = query;

    return (
      <>
        <div className="section gf-form-group">
          <label className="gf-form-group-label width-20">Query Props</label>
          <div className="gf-form">
            <FormField
              label="Metric"
              tooltip="Metric to be presented as a time series"
              inputEl={
                <Select
                  width={20}
                  isSearchable
                  maxVisibleValues={20}
                  minMenuHeight={45}
                  menuPlacement={'bottom'}
                  onChange={this.onMetricChange}
                  value={metric}
                  options={[
                    { value: 'total_bytes', label: 'Total Traffic' },
                    { value: 'sent_bytes', label: 'Edges Traffic' },
                    { value: 'shield_bytes', label: 'Shield Traffic' },
                    { value: 'upstream_bytes', label: 'Origin Traffic' },
                    { value: 'requests', label: 'Total Requests' },
                    { value: 'responses_2xx', label: '2xx Responses' },
                    { value: 'responses_3xx', label: '3xx Responses' },
                    { value: 'responses_4xx', label: '4xx Responses' },
                    { value: 'responses_5xx', label: '5xx Responses' },
                    { value: 'cache_hit_requests_ratio', label: 'Cache Hit Ratio' },
                    { value: 'cache_hit_traffic_ratio', label: 'Byte Cache Hit Ratio' },
                    { value: 'shield_traffic_ratio', label: 'Shield Traffic Ratio' },
                  ]}
                />
              }
            />
          </div>

          <div className="gf-form">
            <FormField
              label="Granularity"
              tooltip="Time series granularity"
              inputEl={
                <Select
                  width={20}
                  maxVisibleValues={4}
                  minMenuHeight={25}
                  menuPlacement={'bottom'}
                  onChange={this.onGranularityChange}
                  value={granularity}
                  options={[
                    { value: '5m', label: '5m' },
                    { value: '15m', label: '15m' },
                    { value: '1h', label: '1h' },
                    { value: '1d', label: '1d' },
                  ]}
                />
              }
            />
          </div>

          <div className="gf-form">
            <FormField
              label="Group By"
              tooltip="Fields used for grouping"
              inputEl={
                <MultiSelect
                  width={20}
                  isSearchable
                  maxVisibleValues={20}
                  minMenuHeight={35}
                  menuPlacement={'bottom'}
                  onChange={this.onGroupingChange}
                  value={grouping}
                  options={[
                    { value: 'client', label: 'Client' },
                    // { value: 'vhost', label: 'Vhost' },
                    { value: 'resource', label: 'Resource' },
                    { value: 'region', label: 'Region' },
                    { value: 'country', label: 'Country' },
                    { value: 'dc', label: 'Datacenter' },
                  ]}
                />
              }
            />
          </div>
        </div>

        <div className="section gf-form-group">
          <label className="gf-form-group-label width-20">Filters (comma separated)</label>

          <div className="gf-form">
            <FormField
              disabled
              width={8}
              value={vhosts}
              onChange={this.onVhostsChange}
              label="Cnames"
              tooltip="Not supported yet"
              type="text"
            />
          </div>
          <div className="gf-form">
            <FormField
              width={8}
              value={resources}
              onChange={this.onResourcesChange}
              label="Resources"
              tooltip="Filter by resource id"
              type="text"
            />
          </div>
          <div className="gf-form">
            <FormField
              width={8}
              value={clients}
              onChange={this.onClientsChange}
              label="Clients"
              tooltip="Filter by client id"
              type="text"
            />
          </div>
        </div>
      </>
    );
  }
}
