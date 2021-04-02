import {
  ArrayVector,
  FieldType,
  formatLabels,
  getDisplayProcessor,
  Labels,
  MutableField,
  TIME_SERIES_TIME_FIELD_NAME,
  TIME_SERIES_VALUE_FIELD_NAME,
  toDataFrame,
} from "@grafana/data";
import { getTemplateSrv } from "@grafana/runtime";
import { GCPoint, GCQuery, GCUnit } from "./types";
import { ScopedVars } from "@grafana/data/types/ScopedVars";
import { MetricFindValue } from "@grafana/data/types/datasource";

export const renderTemplate = (
  aliasPattern: string,
  aliasData: { [key: string]: string }
) => {
  const aliasRegex = /\{\{\s*(.+?)\s*\}\}/g;
  return aliasPattern.replace(aliasRegex, (_match, g1) => {
    if (aliasData[g1]) {
      return aliasData[g1];
    }
    return "";
  });
};

export const takeNumbers = (
  target?: string,
  scopedVars?: ScopedVars,
  format?: string | Function
): number[] => {
  return getTemplateSrv()
    .replace(target || "", scopedVars, format)
    .split(",")
    .filter(Boolean)
    .map((x) => +x);
};

export const takeStrings = (
  target?: string,
  scopedVars?: ScopedVars,
  format?: string | Function
): string[] => {
  return getTemplateSrv()
    .replace(target || "", scopedVars, format)
    .split(",")
    .filter(Boolean);
};

export const getTimeField = (data: GCPoint[], isMs = false): MutableField => ({
  name: TIME_SERIES_TIME_FIELD_NAME,
  type: FieldType.time,
  config: {},
  values: new ArrayVector<number>(
    data.map((val) => (isMs ? val[0] : val[0] * 1000))
  ),
});

export const getEmptyDataFrame = () => {
  return toDataFrame({
    name: "dataFrameName",
    fields: [],
  });
};

type ValueFieldOptions = {
  data: GCPoint[];
  valueName?: string;
  parseValue?: boolean;
  labels?: Labels;
  unit?: GCUnit;
  decimals?: number;
  displayNameFromDS?: string;
  transform?: (value: number) => number;
};

export const getValueField = ({
  data = [],
  valueName = TIME_SERIES_VALUE_FIELD_NAME,
  decimals = 2,
  labels,
  unit,
  displayNameFromDS,
  transform,
}: ValueFieldOptions): MutableField => ({
  labels,
  name: valueName,
  type: FieldType.number,
  display: getDisplayProcessor(),
  config: {
    unit,
    decimals,
    displayNameFromDS,
    displayName: displayNameFromDS,
  },
  values: new ArrayVector<number>(
    data.map((val) => (transform ? transform(val[1]) : val[1]))
  ),
});

export interface LabelInfo {
  name: string;
  labels: Labels;
}

export const createLabelInfo = (
  labels: Labels,
  query: GCQuery,
  scopedVars: ScopedVars
): LabelInfo => {
  if (query?.legendFormat) {
    const title = renderTemplate(
      getTemplateSrv().replace(query.legendFormat, scopedVars),
      labels
    );
    return { name: title, labels };
  }

  const { metric, ...labelsWithoutMetric } = labels;
  const labelPart = formatLabels(labelsWithoutMetric);
  let title = `${metric} ${labelPart}`;
  return { name: title, labels: labelsWithoutMetric };
};

export const getValueVariable = (
  target: Array<string | number>
): MetricFindValue[] => {
  return target.filter(unique).map((text) => ({ text: `${text}` }));
};

export const unique = <T>(v: T, idx: number, a: T[]) => a.indexOf(v) === idx;
