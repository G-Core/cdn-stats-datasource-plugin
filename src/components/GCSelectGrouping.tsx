import React from "react";
import { GCGrouping } from "../types";
import { MultiSelect, MultiSelectCommonProps } from "@grafana/ui";
import { createOptions } from "grouping";

export const GCSelectGrouping: React.FC<
  Omit<MultiSelectCommonProps<GCGrouping>, "options">
> = (opts) => {
  return <MultiSelect {...opts} options={createOptions()} />;
};
