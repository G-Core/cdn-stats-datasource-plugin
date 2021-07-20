import { GCClientMetric, GCQuery, GCResponseStats } from "./types";
import { preferredBandwidth, normalizedBandwidth } from "./bandwidth";
import { getSecondsByGranularity } from "./granularity";
import { createGetterYValues, getUnitByMetric } from "./metric";

type Transform = (value: number) => number;
const noopTransform = (v: number): number => v;

export const getUnit = (
  query: GCQuery,
  data: GCResponseStats[]
): [string, Transform] => {
  const metric = query.metric.value!;
  const granulation = query.granularity.value!;
  const getter = createGetterYValues(metric);

  switch (metric) {
    case GCClientMetric.Bandwidth:
      const times = data.map((p) => getter(p.metrics)).flat();
      // @ts-ignore
      const maxValue = Math.max(...times);
      const period = getSecondsByGranularity(granulation);
      const unit = preferredBandwidth(maxValue, period);
      return [unit, (value) => normalizedBandwidth(value, period, unit)];
    default:
      return [getUnitByMetric(metric), noopTransform];
  }
};
