import React from "react";
import { MultiSelectCommonProps } from "@grafana/ui/components/Select/types";
import { GCGrouping } from "../types";
import { MultiSelect } from "@grafana/ui";
import { createOptions } from "grouping";

export const GCSelectGrouping: React.FC<
  Omit<MultiSelectCommonProps<GCGrouping>, "options">
> = (opts) => {
  return <MultiSelect {...opts} options={createOptions()} />;
};
