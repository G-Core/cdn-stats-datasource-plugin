import React from "react";
import { SelectCommonProps } from "@grafana/ui/components/Select/types";
import { GCGranularity } from "../types";
import { Select } from "@grafana/ui";
import { createOptions } from "granularity";

export const GCSelectGranularity: React.FC<
  Omit<SelectCommonProps<GCGranularity>, "options">
> = (opts) => {
  return <Select {...opts} options={createOptions()} />;
};
