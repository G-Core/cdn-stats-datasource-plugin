import { defaults, omit } from "lodash";
import {
  DataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  dateTimeFormatISO,
  Field,
  Labels,
  LoadingState,
  toDataFrame,
} from "@grafana/data";
import { FetchResponse, getBackendSrv } from "@grafana/runtime";
import {
  GCCdnResource,
  GCDataSourceOptions,
  GCGrouping,
  GCQuery,
  GCResponseStats,
  GCStatsRequestData,
  GCVariable,
  GCVariableQuery,
} from "./types";
import {
  createGetter,
  getLabelByMetric,
  getOriginalMetric,
  getUnitByMetric,
} from "metric";
import {
  createLabelInfo,
  getEmptyDataFrame,
  getTimeField,
  getValueField,
  getValueVariable,
  takeNumbers,
  takeStrings,
} from "./utils";
import { createTransform } from "./transform";
import { defaultQuery } from "./defaults";
import { MetricFindValue } from "@grafana/data/types/datasource";
import { regions } from "./regions";
import { countries } from "countries";

export class DataSource extends DataSourceApi<GCQuery, GCDataSourceOptions> {
  url?: string;

  constructor(
    instanceSettings: DataSourceInstanceSettings<GCDataSourceOptions>
  ) {
    super(instanceSettings);
    this.url = instanceSettings.url;
  }

  async metricFindQuery(
    query: GCVariableQuery,
    options?: any
  ): Promise<MetricFindValue[]> {
    if (!query.selector) {
      return [];
    }

    const selector = query.selector.value!;

    if (
      selector === GCVariable.Client ||
      selector === GCVariable.Resource ||
      selector === GCVariable.Vhost
    ) {
      const {
        data,
      }: {
        data: GCCdnResource[];
      } = await getBackendSrv().datasourceRequest({
        method: "GET",
        url: `${this.url}/resources`,
        responseType: "json",
        showErrorAlert: true,
        params: { fields: "id,cname,client", status: "active" },
      });

      switch (selector) {
        case GCVariable.Vhost:
          return getValueVariable(data.map((item) => item.cname));
        case GCVariable.Resource:
          return getValueVariable(data.map((item) => item.id));
        case GCVariable.Client:
          return getValueVariable(data.map((item) => item.client));
      }
    } else if (selector === GCVariable.Region) {
      return getValueVariable(regions);
    } else if (selector === GCVariable.Country) {
      return getValueVariable(countries);
    }

    return [];
  }

  prepareTargets(targets: GCQuery[]): GCQuery[] {
    return targets.map((query) => defaults(query, defaultQuery));
  }

  async transform(
    data: GCResponseStats[],
    options: DataQueryRequest<GCQuery>,
    query: GCQuery
  ): Promise<DataFrame> {
    if (data.length === 0) {
      return getEmptyDataFrame();
    }

    const fields: Field[] = [];
    const metric = query.metric.value!;
    const getter = createGetter(metric);
    const unit = getUnitByMetric(metric);
    const label = getLabelByMetric(metric);
    const transform = createTransform(options, query);
    const firstPoints = getter(data[0].metrics)!;

    fields.push(getTimeField(firstPoints));

    for (const row of data) {
      const rawLabels: Labels = {
        ...(omit(row, "metrics") as Labels),
        metric: label,
      };

      const metricsData = getter(row.metrics)!;
      const { name, labels } = createLabelInfo(
        rawLabels,
        query,
        options.scopedVars
      );
      const valueField = getValueField({
        unit,
        labels,
        transform,
        data: metricsData,
        displayNameFromDS: name,
      });
      fields.push(valueField);
    }

    return toDataFrame({ fields, refId: query.refId });
  }

  async query(options: DataQueryRequest<GCQuery>): Promise<DataQueryResponse> {
    const promises = this.prepareTargets(options.targets).map(async (query) => {
      const response = await this.doRequest(options, query);
      const data = response.data || [];
      return this.transform(data, options, query);
    });

    return {
      data: await Promise.all(promises),
      key: options.requestId,
      state: LoadingState.Done,
    };
  }

  async doRequest(
    options: DataQueryRequest<GCQuery>,
    query: GCQuery
  ): Promise<FetchResponse<GCResponseStats[]>> {
    const { range } = options;

    const metric = getOriginalMetric(query.metric.value!);

    const vhosts = takeStrings(query.vhosts, options.scopedVars, "csv");
    const clients = takeNumbers(query.clients, options.scopedVars, "csv");
    const regions = takeStrings(query.regions, options.scopedVars, "csv");
    const resources = takeNumbers(query.resources, options.scopedVars, "csv");
    const countries = takeStrings(query.countries, options.scopedVars, "csv");

    const data: GCStatsRequestData = {
      metrics: [metric],
      from: dateTimeFormatISO(range!.from.valueOf()),
      to: dateTimeFormatISO(range!.to.valueOf()),
      granularity: query.granularity.value!,
      flat: true,
    };

    if (resources.length > 0) {
      data.resources = resources;
    }

    if (vhosts.length > 0) {
      data.vhosts = vhosts;
    }

    if (clients.length > 0) {
      data.clients = clients;
    }

    if (regions.length > 0) {
      data.regions = regions;
    }

    if (countries.length > 0) {
      data.countries = countries;
    }

    if (query.grouping && query.grouping.length > 0) {
      data.group_by = query.grouping.reduce(
        (acc, item) => [...acc, item.value!],
        [] as GCGrouping[]
      );
    }

    // TODO: Use the fetch function instead datasourceRequest
    return getBackendSrv().datasourceRequest({
      method: "POST",
      url: `${this.url}/statistics/aggregate/stats`,
      params: {
        service: "CDN",
      },
      responseType: "json",
      showErrorAlert: true,
      data,
    });
  }

  async testDatasource(): Promise<any> {
    try {
      // TODO: Use the fetch function instead datasourceRequest
      const resp = await getBackendSrv().datasourceRequest({
        method: "GET",
        url: `${this.url}/users/me`,
        responseType: "json",
        showErrorAlert: true,
      });

      return {
        status: "success",
        message: "You successfully authenticated as " + resp.data.name,
      };
    } catch (e) {
      let message = e.statusText;

      if (e.data && e.data.message) {
        message = e.data.message;
      }

      return {
        status: e.status,
        message: message,
      };
    }
  }
}
