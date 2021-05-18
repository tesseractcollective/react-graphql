import { default as React, useEffect, useState } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { MutateState } from '../../hooks/useMutate';
import { bs } from '../../support/styling/buildStyles';

export interface MutatorInputProps {
  state: MutateState;
  input: string;
  defaultValue?: string;
  value?: string;
  clearState?: boolean;
}

const defaultStyleStr = `b-0 bb-1 p-sxx p-s mb-s`;

export function MutatorTextInput(props: MutatorInputProps & TextInputProps) {
  const { state, input, defaultValue, ...rest } = props;
  const [value, setValue] = useState<string>(props.value || defaultValue || '');
  useEffect(() => {
    const newValue = state?.resultItem?.[input];
    if (
      typeof(newValue) === 'string' &&
      newValue !== value
    ) {
      setValue(newValue);
    }
  }, [state?.resultItem?.[input]]);

  useEffect(() => {
    if (props.value !== value) {
      setValue(props.value || '');
    }
  }, [props.value]);

  useEffect(() => {
    const newValue = state?.variables?.[input];
    if (
      typeof(newValue) === 'string' &&
      newValue !== value
    ) {
      setValue(newValue);
    }
  }, [state.variables]);

  useEffect(() => {
    if (props.clearState) {
      setValue('');
    }
  }, [props.clearState]);

  return (
    <TextInput
      {...rest}
      style={rest.style || bs(defaultStyleStr)}
      value={value}
      onChangeText={(text) => state.setVariable(input, text)}
    />
  );
}

MutatorTextInput.defaultStyleStr = defaultStyleStr;
