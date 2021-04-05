import { createOptionForMetric } from "./metric";
import { createOptionForGrouping } from "./grouping";
import { createOptionForGranularity } from "./granularity";
import {
  GCGranularity,
  GCGrouping,
  GCQuery,
  GCServerMetric,
  GCVariable,
  GCVariableQuery,
} from "./types";

export const defaultQuery: Partial<GCQuery> = {
  vhosts: "",
  clients: "",
  resources: "",
  metric: createOptionForMetric(GCServerMetric.TotalBytes),
  grouping: [createOptionForGrouping(GCGrouping.Resource)],
  granularity: createOptionForGranularity(GCGranularity.OneHour),
};
export const defaultVariableQuery: Partial<GCVariableQuery> = {
  selector: { value: GCVariable.Resource, label: "resourceID" },
};
