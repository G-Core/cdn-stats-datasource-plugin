import defaults from "lodash/defaults";
import React, { useState } from "react";
import { Select } from "@grafana/ui";
import { SelectableValue } from "@grafana/data";
import { GCVariable, GCVariableQuery } from "../types";
import { defaultVariableQuery } from "../defaults";

export interface GCVariableQueryProps {
  query: GCVariableQuery;
  onChange: (query: GCVariableQuery, definition: string) => void;
}

export const GCVariableQueryEditor: React.FC<GCVariableQueryProps> = ({
  onChange,
  query: rawQuery,
}) => {
  const query = defaults(rawQuery, defaultVariableQuery);
  const [state, setState] = useState(query);

  const saveQuery = () => {
    onChange(state, `${state.selector.label}`);
  };

  const handleChange = (selector: SelectableValue<GCVariable>) =>
    setState({ ...state, selector });

  return (
    <div className="gf-form">
      <span className="gf-form-label width-10">Values for</span>
      <Select
        width={16}
        maxVisibleValues={20}
        minMenuHeight={45}
        menuPlacement={"bottom"}
        onBlur={saveQuery}
        onChange={handleChange}
        value={state.selector}
        options={[
          { value: GCVariable.Resource, label: "resourceID" },
          { value: GCVariable.Vhost, label: "vhost" },
          { value: GCVariable.Client, label: "client" },
          { value: GCVariable.Country, label: "country" },
          { value: GCVariable.Region, label: "region" },
        ]}
      />
    </div>
  );
};
