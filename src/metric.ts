import {
  GCServerMetric,
  GCUnit,
  GCMetric,
  GCPoint,
  GCClientMetric,
} from "./types";
import { SelectableValue } from "@grafana/data";

export interface GCReportsConfig {
  originalMetric: GCServerMetric;
  label: string;
  unit: GCUnit;
}

export type GCGetterFn<T> = (
  data: Partial<Record<GCServerMetric, GCPoint[]>>
) => T;

const config: Record<GCMetric, GCReportsConfig> = {
  [GCClientMetric.Bandwidth]: {
    originalMetric: GCServerMetric.TotalBytes,
    label: "Bandwidth",
    unit: GCUnit.Bandwidth,
  },
  [GCServerMetric.TotalBytes]: {
    originalMetric: GCServerMetric.TotalBytes,
    label: "Total Traffic",
    unit: GCUnit.Bytes,
  },
  [GCServerMetric.UpstreamBytes]: {
    originalMetric: GCServerMetric.UpstreamBytes,
    label: "Origin Traffic",
    unit: GCUnit.Bytes,
  },
  [GCServerMetric.SentBytes]: {
    originalMetric: GCServerMetric.SentBytes,
    label: "Edges Traffic",
    unit: GCUnit.Bytes,
  },
  [GCServerMetric.ShieldBytes]: {
    originalMetric: GCServerMetric.ShieldBytes,
    label: "Shield Traffic",
    unit: GCUnit.Bytes,
  },
  [GCServerMetric.Requests]: {
    originalMetric: GCServerMetric.Requests,
    label: "Total Requests",
    unit: GCUnit.Number,
  },
  [GCServerMetric.Responses2xx]: {
    originalMetric: GCServerMetric.Responses2xx,
    label: "2xx Responses",
    unit: GCUnit.Number,
  },
  [GCServerMetric.Responses3xx]: {
    originalMetric: GCServerMetric.Responses3xx,
    label: "3xx Responses",
    unit: GCUnit.Number,
  },
  [GCServerMetric.Responses4xx]: {
    originalMetric: GCServerMetric.Responses4xx,
    label: "4xx Responses",
    unit: GCUnit.Number,
  },
  [GCServerMetric.Responses5xx]: {
    originalMetric: GCServerMetric.Responses5xx,
    label: "5xx Responses",
    unit: GCUnit.Number,
  },
  [GCServerMetric.CacheHitRequestsRatio]: {
    originalMetric: GCServerMetric.CacheHitRequestsRatio,
    label: "Cache Hit Ratio",
    unit: GCUnit.Percent,
  },
  [GCServerMetric.CacheHitTrafficRatio]: {
    originalMetric: GCServerMetric.CacheHitTrafficRatio,
    label: "Byte Cache Hit Ratio",
    unit: GCUnit.Percent,
  },
  [GCServerMetric.ShieldTrafficRatio]: {
    originalMetric: GCServerMetric.ShieldTrafficRatio,
    label: "Shield Traffic Ratio",
    unit: GCUnit.Percent,
  },
};

export const createOptions = () =>
  Object.entries(config).map(
    ([value, { label }]) => ({ value, label } as SelectableValue<GCMetric>)
  );
export const createOptionForMetric = (
  metric: GCMetric
): SelectableValue<GCMetric> => ({ value: metric, ...config[metric] });
export const getOriginalMetric = (metric: GCMetric): GCServerMetric =>
  config[metric].originalMetric;
export const getLabelByMetric = (metric: GCMetric): string =>
  config[metric].label;
export const getUnitByMetric = (metric: GCMetric): GCUnit =>
  config[metric].unit;
export const createGetterSample = (metric: GCMetric): GCGetterFn<GCPoint[]> => (
  data: Partial<Record<GCServerMetric, GCPoint[]>>
): GCPoint[] => {
  const originalMetric = getOriginalMetric(metric);
  if (data[originalMetric]) {
    return data[originalMetric] || [];
  }
  return [];
};
export const createGetterYValues = (metric: GCMetric): GCGetterFn<number[]> => (
  data: Partial<Record<GCServerMetric, GCPoint[]>>
): number[] => {
  const originalMetric = getOriginalMetric(metric);
  if (data[originalMetric]) {
    const points = data[originalMetric] || [];
    return points.map((p) => p[1]);
  }
  return [];
};
