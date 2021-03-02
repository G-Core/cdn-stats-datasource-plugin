import defaults from 'lodash/defaults';

import {
  DataQueryRequest,
  dateTimeFormatISO,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  FieldType,
  Labels,
  // MutableField,
  toDataFrame,
} from '@grafana/data';

import { getBackendSrv, getTemplateSrv } from '@grafana/runtime';

import { MyQuery, MyDataSourceOptions, MyVariableQuery, StatsRequestData, defaultQuery } from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  url?: string;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);

    this.url = instanceSettings.url;
  }

  async metricFindQuery(query: MyVariableQuery, options?: any) {
    if (!query.selector) {
      return [];
    }

    const response = await getBackendSrv().datasourceRequest({
      method: 'GET',
      url: this.url + '/resources',
      responseType: 'json',
      showErrorAlert: true,
      params: { fields: 'id,cname,client', status: 'active' },
    });

    return response.data
      .map((frame: any) => ({ text: frame[query.selector.value || ''] }))
      .filter((v: any, i: any, a: any) => a.indexOf(v) === i);
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const promises = options.targets.map(query => {
      query = defaults(query, defaultQuery);

      return this.doRequest(options, query).then(response => {
        let tsValuesCalculated = false;
        const tsValues: any[] = [];
        const fields: any[] = [];

        const data = response.data || [];
        data.forEach((row: any, idx: number) => {
          let labels: Labels = {};
          for (let key in row) {
            if (key === 'metrics') {
              continue;
            }

            labels[key] = row[key];
          }

          let values: any[] = [];
          let field = {
            name: query.metric.value,
            type: FieldType.number,
            labels: labels,
            values: values,
            config: {
              displayName: '',
            },
          };

          row.metrics[query.metric.value].forEach((point: any) => {
            if (!tsValuesCalculated) {
              tsValues.push(point[0] * 1000);
            }

            field.values.push(point[1]);
          });

          fields.push(field);
          tsValuesCalculated = true;
        });

        fields.push({
          name: 'Time',
          type: FieldType.time,
          values: tsValues,
        });

        return toDataFrame({
          name: 'dataFrameName',
          fields: fields,
        });
      });
    });

    return Promise.all(promises).then(data => ({ data }));
  }

  async doRequest(options: DataQueryRequest<MyQuery>, query: MyQuery) {
    const { range } = options;
    const rawResourceIDs: string = getTemplateSrv().replace(query.resources, options.scopedVars, 'csv');
    const resourceIDs: number[] = rawResourceIDs
      .split(',')
      .filter(Boolean)
      .map(x => +x);

    const rawVhosts: string = getTemplateSrv().replace(query.vhosts, options.scopedVars, 'csv');
    const vhosts: string[] = rawVhosts.split(',').filter(Boolean);

    const rawClients: string = getTemplateSrv().replace(query.clients, options.scopedVars, 'csv');
    const clients: number[] = rawClients
      .split(',')
      .filter(Boolean)
      .map(x => +x);

    const data: StatsRequestData = {
      metrics: [query.metric.value],
      from: dateTimeFormatISO(range!.from.valueOf()),
      to: dateTimeFormatISO(range!.to.valueOf()),
      granularity: query.granularity.value,
      flat: true,
    };

    if (resourceIDs && resourceIDs.length > 0) {
      data.resources = resourceIDs;
    }

    if (vhosts && vhosts.length > 0) {
      data.vhosts = vhosts;
    }

    if (clients && clients.length > 0) {
      data.clients = clients;
    }

    if (query.grouping && query.grouping.length > 0) {
      let groupings: string[] = [];
      query.grouping.forEach((g: any) => groupings.push(g.value));
      data.group_by = groupings;
    }

    return await getBackendSrv().datasourceRequest({
      method: 'POST',
      url: this.url + '/statistics/aggregate/stats',
      responseType: 'json',
      showErrorAlert: true,
      data,
    });
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
