import React from "react";
import { GCGranularity } from "../types";
import { Select, SelectCommonProps } from "@grafana/ui";
import { createOptions } from "granularity";

export const GCSelectGranularity: React.FC<
  Omit<SelectCommonProps<GCGranularity>, "options">
> = (opts) => {
  return <Select {...opts} options={createOptions()} />;
};
