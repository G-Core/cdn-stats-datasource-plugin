import React from "react";
import { Select } from "@grafana/ui";
import { SelectCommonProps } from "@grafana/ui/components/Select/types";
import { GCMetric } from "types";
import { createOptions } from "../metric";

export const GCSelectMetric: React.FC<
  Omit<SelectCommonProps<GCMetric>, "options">
> = (opts) => {
  return <Select {...opts} options={createOptions()} />;
};
