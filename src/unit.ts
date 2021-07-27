import { GCQuery, GCResponseStats, GCUnit } from "./types";
import { normalizedBandwidth, preferredBandwidth } from "./bandwidth";
import { getSecondsByGranularity } from "./granularity";
import { createGetterYValues, getUnitByMetric } from "./metric";
import { ByteUnitEnum, normalizeBytes, preferredBytes } from "./byte-converter";

type Transform = (value: number) => number;
const noopTransform = (v: number): number => v;

export const getUnit = (
  query: GCQuery,
  data: GCResponseStats[]
): [string, Transform] => {
  const metric = query.metric.value!;
  const granulation = query.granularity.value!;
  const getter = createGetterYValues(metric);
  const rawUnit = getUnitByMetric(metric);

  if (rawUnit === GCUnit.Bandwidth) {
    const times = data.map((p) => getter(p.metrics)).flat();
    // @ts-ignore
    const maxValue = Math.max(...times);
    const period = getSecondsByGranularity(granulation);
    const unit = preferredBandwidth(maxValue, period);
    return [unit, (value) => normalizedBandwidth(value, period, unit)];
  } else if (rawUnit === GCUnit.Bytes) {
    const times = data.map((p) => getter(p.metrics)).flat();
    // @ts-ignore
    const maxValue = Math.max(...times);
    const unit = preferredBytes(maxValue, ByteUnitEnum.B);
    return [unit, (value) => normalizeBytes(value, ByteUnitEnum.B, unit)];
  } else {
    return [getUnitByMetric(metric), noopTransform];
  }
};
