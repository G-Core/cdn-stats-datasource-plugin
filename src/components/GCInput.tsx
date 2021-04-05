import React, { ChangeEvent, useRef, useState } from "react";
import { LegacyForms } from "@grafana/ui";
import { debounce } from "lodash";

const { FormField } = LegacyForms;

export interface InputProps<T>
  extends Omit<React.HTMLProps<HTMLInputElement>, "value"> {
  width?: number;
  inputWidth?: number;
  value?: T;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  tooltip?: string;
  type: string;
  label: string;
  debounce?: number;
}

export const GCInput: React.FC<InputProps<string>> = (rawProps) => {
  const { onChange, ...props } = rawProps;
  const [value, setValue] = useState(props.value);
  const debouncedFunc = useRef(
    debounce((q) => onChange(q), props.debounce || 500)
  ).current;
  const onChangeDebounce = (e: ChangeEvent<HTMLInputElement>) => {
    e.persist();
    setValue(e.target.value);
    debouncedFunc(e);
  };
  return <FormField {...props} value={value} onChange={onChangeDebounce} />;
};
