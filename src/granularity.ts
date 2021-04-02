import { TimeInSeconds } from "times";
import { GCGranularity } from "./types";
import { SelectableValue } from "@grafana/data";

export interface GCGranularityConfig {
  label: string;
  seconds: number;
}

const config: Record<GCGranularity, GCGranularityConfig> = {
  [GCGranularity.FiveMinutes]: {
    label: "5m",
    seconds: 5 * TimeInSeconds.MINUTE,
  },
  [GCGranularity.FifteenMinutes]: {
    label: "15m",
    seconds: 15 * TimeInSeconds.MINUTE,
  },
  [GCGranularity.OneHour]: { label: "1h", seconds: TimeInSeconds.HOUR },
  [GCGranularity.OneDay]: { label: "1d", seconds: TimeInSeconds.DAY },
};

export const createOptions = () =>
  Object.entries(config).map(
    ([value, { label }]) => ({ value, label } as SelectableValue<GCGranularity>)
  );
export const getSecondsByGranularity = (granularity: GCGranularity): number =>
  config[granularity].seconds;
export const createOptionForGranularity = (
  granularity: GCGranularity
): SelectableValue<GCGranularity> => ({
  value: granularity,
  ...config[granularity],
});
