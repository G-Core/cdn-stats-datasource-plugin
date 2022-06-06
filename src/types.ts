import { DataQuery, DataSourceJsonData, SelectableValue } from "@grafana/data";

export enum GCServerMetric {
  UpstreamBytes = "upstream_bytes",
  TotalBytes = "total_bytes",
  SentBytes = "sent_bytes",
  ShieldBytes = "shield_bytes",
  Requests = "requests",
  Responses2xx = "responses_2xx",
  Responses3xx = "responses_3xx",
  Responses4xx = "responses_4xx",
  Responses5xx = "responses_5xx",
  CacheHitRequestsRatio = "cache_hit_requests_ratio",
  CacheHitTrafficRatio = "cache_hit_traffic_ratio",
  ShieldTrafficRatio = "shield_traffic_ratio",
  ImageProcessed = "image_processed",
  RequestWafPassed = "requests_waf_passed",
}

export enum GCClientMetric {
  Bandwidth = "bandwidth",
}

export type GCMetric = GCServerMetric | GCClientMetric;

export enum GCGrouping {
  Resource = "resource",
  Region = "region",
  VHost = "vhost",
  Client = "client",
  Country = "country",
  DC = "dc",
}

export enum GCGranularity {
  FiveMinutes = "5m",
  FifteenMinutes = "15m",
  OneHour = "1h",
  OneDay = "1d",
}

export interface GCQuery extends DataQuery {
  metric: SelectableValue<GCMetric>;
  granularity: SelectableValue<GCGranularity>;
  grouping?: Array<SelectableValue<GCGrouping>>;
  countries?: string;
  regions?: string;
  vhosts?: string;
  resources?: string;
  clients?: string;
  legendFormat?: string;
}

export enum GCUnit {
  Number = "none",
  Bandwidth = "bit/sec",
  Bytes = "bytes",
  Percent = "none",
}

export interface GCStatsRequestData {
  metrics: GCServerMetric[];
  vhosts?: string[];
  regions?: string[];
  resources?: number[];
  clients?: number[];
  countries?: string[];
  from: string;
  to: string;
  granularity: GCGranularity;
  flat: boolean;
  group_by?: GCGrouping[];
}

export interface GCCdnResource {
  id: number;
  cname: string;
  client: number;
}

/**
 * These are options configured for each DataSource instance
 */
export interface GCDataSourceOptions extends DataSourceJsonData {
  path?: string;
  apiKey?: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface GCSecureJsonData {
  apiKey?: string;
}

export enum GCVariable {
  Resource = "resource",
  Client = "client",
  Vhost = "vhost",
  Region = "region",
  Country = "country",
  Datacenter = "datacenter",
}

export interface GCVariableQuery {
  selector: SelectableValue<GCVariable>;
}

export type GCPoint = [number, number];

export interface GCResponseStats {
  metrics: Partial<Record<GCServerMetric, GCPoint[]>>;
  client?: number;
  region?: string;
  vhost?: string;
  country?: string;
  dc?: string;
  resource?: number;
}
