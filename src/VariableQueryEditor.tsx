import defaults from 'lodash/defaults';

import React, { useState } from 'react';
import { Select } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';
import { MyVariableQuery, defaultVariableQuery } from './types';

interface VariableQueryProps {
  query: MyVariableQuery;
  onChange: (query: MyVariableQuery, definition: string) => void;
}

export const VariableQueryEditor: React.FC<VariableQueryProps> = ({ onChange, query }) => {
  query = defaults(query, defaultVariableQuery);
  const [state, setState] = useState(query);

  const saveQuery = () => {
    onChange(state, `${state.selector.label}`);
  };

  const handleChange = (selector: SelectableValue<string>) =>
    setState({
      ...state,
      selector,
    });

  return (
    <>
      <div className="gf-form">
        <span className="gf-form-label width-10">Values for</span>
        <Select
          width={16}
          maxVisibleValues={20}
          minMenuHeight={45}
          menuPlacement={'bottom'}
          onBlur={saveQuery}
          onChange={handleChange}
          value={state.selector}
          options={[
            { value: 'id', label: 'resourceID' },
            // { value: 'cname', label: 'cname' },
            { value: 'client', label: 'client' },
          ]}
        />
      </div>
    </>
  );
};
