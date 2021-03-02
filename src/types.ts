import { DataQuery, DataSourceJsonData, SelectableValue } from "@grafana/data";

export interface MyQuery extends DataQuery {
  metric: SelectableValue<any>;
  granularity: SelectableValue<any>;
  grouping?: Array<SelectableValue<any>>;
  vhosts?: string;
  resources?: string;
  clients?: string;
}

export const defaultQuery: Partial<MyQuery> = {
  metric: { value: "total_bytes", label: "Total Traffic" },
  granularity: { value: "1h", label: "1h" },
  grouping: [],
  vhosts: "",
  resources: "",
  clients: ""
};

export interface StatsRequestData {
  metrics: string[];
  vhosts?: string[];
  resources?: number[];
  clients?: number[];
  from: any;
  to: any;
  granularity: any;
  flat: boolean;
  group_by?: any[];
}

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  path?: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  apiKey?: string;
}

export interface MyVariableQuery {
  selector: SelectableValue<string>;
}

export const defaultVariableQuery: Partial<MyVariableQuery> = {
  selector: { value: "cname", label: "cname" }
};
