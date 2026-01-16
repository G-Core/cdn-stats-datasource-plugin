import {
  DataSourceInstanceSettings,
  MetricFindValue,
} from "@grafana/data";
import { DataSourceWithBackend, getBackendSrv } from "@grafana/runtime";
import { range } from "lodash";
import {
  GCCdnResource,
  GCDataSourceOptions,
  GCQuery,
  GCVariable,
  GCVariableQuery,
  Paginator,
} from "./types";
import { getValueVariable } from "./utils";
import { regions } from "./regions";
import { countries } from "./countries";

export class DataSource extends DataSourceWithBackend<GCQuery, GCDataSourceOptions> {
  id: number;

  constructor(instanceSettings: DataSourceInstanceSettings<GCDataSourceOptions>) {
    super(instanceSettings);
    this.id = instanceSettings.id;
  }

  async metricFindQuery(query: GCVariableQuery): Promise<MetricFindValue[]> {
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
    const getGCCdnResources = (limit: number, offset = 0) =>
      getBackendSrv().datasourceRequest<Paginator<GCCdnResource>>({
        method: "GET",
        url: `api/datasources/${this.id}/resources`,
        responseType: "json",
        showErrorAlert: true,
        params: {
          fields: "id,cname,client",
          deleted: true,
          limit,
          offset,
        },
      }).catch((error) => {
        if (error.status === 401) {
          throw new Error("Unauthorized: Invalid API Key. Please check your datasource configuration.");
        }
        throw error;
      });

    const limit = 1000;
    const firstChunk = await getGCCdnResources(limit);
    const cdnResourcesCount = firstChunk.data.count;

    if (cdnResourcesCount <= limit) {
      return firstChunk.data.results;
    } else {
      const restChunkRequests = range(limit, cdnResourcesCount, limit).map((offset) =>
        getGCCdnResources(limit, offset)
      );
      const restChunks = await Promise.all(restChunkRequests);
      return restChunks.reduce(
        (acc, current) => acc.concat(current.data.results),
        firstChunk.data.results
      );
    }
  }

  filterQuery(query: GCQuery): boolean {
    return !query.hide && !!query.metric?.value;
  }
}