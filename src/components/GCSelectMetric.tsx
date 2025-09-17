import React from "react";
import { Select, SelectCommonProps } from "@grafana/ui";
import { GCMetric } from "types";
import { createOptions } from "../metric";

export const GCSelectMetric: React.FC<
  Omit<SelectCommonProps<GCMetric>, "options">
> = (opts) => {
  return <Select {...opts} options={createOptions()} />;
};
