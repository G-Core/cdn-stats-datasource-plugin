import { SelectableValue } from "@grafana/data";
import { GCGrouping } from "./types";

interface GCGroupingConfig {
  label: string;
}

const config: Record<GCGrouping, GCGroupingConfig> = {
  [GCGrouping.Client]: { label: "Client" },
  [GCGrouping.VHost]: { label: "Vhost" },
  [GCGrouping.Resource]: { label: "Resource" },
  [GCGrouping.Region]: { label: "Region" },
  [GCGrouping.Country]: { label: "Country" },
  [GCGrouping.DC]: { label: "Datacenter" },
};

export const createOptions = () =>
  Object.entries(config).map(
    ([value, { label }]) => ({ value, label } as SelectableValue<GCGrouping>)
  );
export const createOptionForGrouping = (
  grouping: GCGrouping
): SelectableValue<GCGrouping> => ({ value: grouping, ...config[grouping] });
