import { GCQuery, GCClientMetric } from "./types";
import { DataQueryRequest } from "@grafana/data";
import { getSecondsByGranularity } from "./granularity";

const noopTransform = (v: number): number => v;

type Transform = (value: number) => number;

export const createTransform = (
  options: DataQueryRequest<GCQuery>,
  query: GCQuery
): Transform => {
  const metric = query.metric.value!;
  switch (metric) {
    case GCClientMetric.Bandwidth:
      const seconds = getSecondsByGranularity(query.granularity?.value!);
      return (value) => (value * 8) / seconds;
    default:
      return noopTransform;
  }
};
