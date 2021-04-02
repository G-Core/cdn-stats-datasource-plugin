import { DataSourcePlugin } from "@grafana/data";
import { DataSource } from "./datasource";
import { GCConfigEditor } from "./components/GCConfigEditor";
import { GCQueryEditor } from "./components/GCQueryEditor";
import { GCVariableQueryEditor } from "./components/GCVariableQueryEditor";

export const plugin = new DataSourcePlugin(DataSource)
  .setConfigEditor(GCConfigEditor)
  .setQueryEditor(GCQueryEditor)
  .setVariableQueryEditor(GCVariableQueryEditor);
