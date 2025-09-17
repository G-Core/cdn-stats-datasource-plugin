import { defaults, omit, range } from "lodash";
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
  MetricFindValue,
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
  Paginator,
} from "./types";
import {
  createGetterSample,
  getLabelByMetric,
  getOriginalMetric,
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
import { defaultQuery } from "./defaults";
import { regions } from "./regions";
import { countries } from "countries";
import { getUnit } from "./unit";

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
      const cdnResource: GCCdnResource[] = await this.getAllGCCdnResources();

      switch (selector) {
        case GCVariable.Vhost:
          return getValueVariable(cdnResource.map((item) => item.cname));
        case GCVariable.Resource:
          return getValueVariable(cdnResource.map((item) => item.id));
        case GCVariable.Client:
          return getValueVariable(cdnResource.map((item) => item.client));
      }
    } else if (selector === GCVariable.Region) {
      return getValueVariable(regions);
    } else if (selector === GCVariable.Country) {
      return getValueVariable(countries);
    }

    return [];
  }

  private async getAllGCCdnResources(): Promise<GCCdnResource[]> {
    const getGCCdnResources = (
      limit: number,
      offset = 0
    ): Promise<{ data: Paginator<GCCdnResource> }> =>
      getBackendSrv().datasourceRequest({
        method: "GET",
        url: `${this.url}/resources`,
        responseType: "json",
        showErrorAlert: true,
        params: {
          fields: "id,cname,client",
          deleted: true,
          limit,
          offset,
        },
      });

    const limit = 1000;

    const firstChunk = await getGCCdnResources(limit);

    const cdnResourcesCount = firstChunk.data.count;

    if (cdnResourcesCount <= limit) {
      return firstChunk.data.results;
    } else {
      const restChunkRequests = range(
        limit,
        cdnResourcesCount,
        limit
      ).map((offset) => getGCCdnResources(limit, offset));

      const restChunks = await Promise.all(restChunkRequests);

      return restChunks.reduce(
        (acc, current) => acc.concat(current.data.results),
        firstChunk.data.results
      );
    }
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
    const getter = createGetterSample(metric);
    const label = getLabelByMetric(metric);
    const sample = getter(data[0].metrics);
    const [unit, transform] = getUnit(query, data);

    fields.push(getTimeField(sample));

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
        decimals: 2,
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
        // @ts-ignore
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
        message: `You successfully authenticated as ${resp.data.name}`,
      };
    } catch (e) {
      // @ts-ignore
      let message = e.statusText;

      // @ts-ignore
      if (e.data && e.data.message) {
        // @ts-ignore
        message = e.data.message;
      }

      return {
        status: "error",
        message: message,
      };
    }
  }
}
