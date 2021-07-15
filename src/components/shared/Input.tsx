import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import {
  View,
  TextInputBase,
  Constructor,
  NativeMethods,
  TimerMixin,
  TextInputProps,
  Text,
  ViewProps,
} from 'react-native';
import { MutateState } from '../../hooks/useMutate';
import { HasuraDataConfig } from '../../types/hasuraConfig';
//@ts-ignore
import Select from 'react-native-web-ui-components/Select';
//@ts-ignore
import Autocomplete from 'react-native-web-ui-components/Autocomplete';
//@ts-ignore
import TextInput from 'react-native-web-ui-components/TextInput';
//@ts-ignore
import RNWUIDatePicker from 'react-native-web-ui-components/Datepicker';
//@ts-ignore
import RNWUICheckbox from 'react-native-web-ui-components/Checkbox';
//@ts-ignore
import RNWUIDropzone from 'react-native-web-ui-components/Dropzone';
import { useReactGraphql } from '../../hooks/useReactGraphql';
import HasuraConfig from '../../../tests/TestHasuraConfig';

//TODO: Translations: All labels and placeholders and errors can check against translations

export interface IInputProps {
  state: MutateState;
  name: string;
  disabled?: boolean;
}

export interface IInputNumberProps {}
export interface IInputRichTextProps {}

export interface TInput {
  Text: FunctionComponent<IInputTextProps>; //DONE
  Number: FunctionComponent<IInputNumberProps>;
  Checkbox: FunctionComponent<IInputCheckboxProps>; //DONE
  DatePicker: FunctionComponent<IInputDateProps>; //DONE
  Image: FunctionComponent<IInputProps>; //1 - rnwui
  File: FunctionComponent<IInputFileProps>; //1 - rnwui
  Markdown: FunctionComponent<IInputProps>;
  Password: FunctionComponent<IInputProps>;
  RichText: FunctionComponent<IInputRichTextProps>; // 1
  Select: FunctionComponent<IInputProps>;
  SelectViaRelationship: FunctionComponent<SelectViaRelationshipProps>;
  RadioButtonGroup: FunctionComponent<IInputProps>;
  SelectMany: FunctionComponent<IInputProps>;
  List: FunctionComponent<IInputProps>;
  CheckboxMany: FunctionComponent<IInputProps>;
}

const Input: FunctionComponent<IInputProps> = function Inputs(props) {
  return <View></View>;
} as InputType;

//TEXT INPUT
export interface IInputTextProps extends TextInputProps {
  state: MutateState;
  name: string;
  disabled?: boolean;
}

(Input as FunctionComponent<IInputProps> & TInput).Text = function InputText(props) {
  const { state, name, disabled } = props;

  return (
    <View>
      <TextInput
        placeholder={props.placeholder}
        value={state.item?.[name]?.toString()}
        editable={!disabled}
        onChangeText={(text: string) => props.state.setItemValue(props.name, text)}
      />
    </View>
  );
};

(Input as FunctionComponent<IInputProps> & TInput).RichText = function RichText(props) {
  //TODO: P2: Need to find react-native-web compatible rich text editor, OR a rich text editor for React and react-native separately
  return <View></View>;
};

export interface IInputDateProps extends IInputProps {
  placeholder?: string;
  format?: string;
}

(Input as FunctionComponent<IInputProps> & TInput).DatePicker = function DatePicker(props) {
  const { state, name, disabled } = props;

  return (
    <RNWUIDatePicker      
      disabled={disabled}
      placeholder={props.placeholder}
      format={props.format}
      date={state.item?.[name] || ''}
      onDateChange={(date: any) => state.setItemValue(name, new Date(date))}
    />
  );
};

(Input as FunctionComponent<IInputProps> & TInput).Number = function Inputs(props) {
  //Might be able to do this through just the TextInputComponent changing keyboard to number
  return <View></View>;
};

export interface IInputCheckboxProps {
  checked: boolean;
  disabled?: boolean;
  text?: string;
  value?: any;
  onPress?: () => void;
}

(Input as FunctionComponent<IInputProps> & TInput).Checkbox = function Inputs(props) {
  const { checked, disabled, text, value, onPress } = props;
  //should state for check be here so they each have their own?
  return (
    <View>
      <RNWUICheckbox checked={checked} disabled={disabled} text={text} value={value} onPress={onPress} />
    </View>
  );
};

(Input as FunctionComponent<IInputProps> & TInput).Image = function Inputs(props) {
  //Uplaod image??
  return <View></View>;
};

export interface IInputFileProps {
  onDrop: (file: any) => void;
  text?: string;
}

(Input as FunctionComponent<IInputProps> & TInput).File = function Inputs(props) {
  const { onDrop, text } = props;
  return (
    <View>
      <RNWUIDropzone
        onDrop={onDrop}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'grey',
          cursor: 'pointer',
        }}
      >
        <Text style={{ color: 'grey' }}>{text ? text : 'Click or drag and drop a file here'}</Text>
      </RNWUIDropzone>
    </View>
  );
};
(Input as FunctionComponent<IInputProps> & TInput).Markdown = function Inputs(props) {
  return <View></View>;
};
(Input as FunctionComponent<IInputProps> & TInput).Password = function Inputs(props) {
  return <View></View>;
};

(Input as FunctionComponent<IInputProps> & TInput).Select = function Inputs(props) {
  //can take in a basedOnField name to filter the options down by it's selection selection
  //Can be a drop down, or an action sheet(native), or a modal(web)
  return <View></View>;
};

export interface SelectViaRelationshipProps {
  state: MutateState;
  name: string;
  configForRelationship: HasuraDataConfig;
  relationshipColumnNameForLabel: String;
  relationshipColumnNameForValue: String;
  autoSave?: boolean;
  menuStyle?: ViewProps | Readonly<ViewProps>;
  containerStyle?: ViewProps | Readonly<ViewProps>;
}

(Input as FunctionComponent<IInputProps> & TInput).SelectViaRelationship = function SelectViaRelationship(props) {
  const {
    state,
    name,
    configForRelationship,
    relationshipColumnNameForLabel,
    relationshipColumnNameForValue,
    autoSave,
  } = props;

  const [value, setValue] = useState<string>('');

  const dataApi = useReactGraphql(configForRelationship);
  const queryState = dataApi.useInfiniteQueryMany({
    pageSize: 1000,
  });

  const optionsLabelToValueMap: { [key: string]: string } = useMemo(() => {
    return queryState.items.reduce((all: any, next: any) => {
      all[next?.[relationshipColumnNameForLabel as any]] = next?.[relationshipColumnNameForValue as any];
      return all;
    }, {}) as { [key: string]: string };
  }, [queryState.items.length]);

  const optionsValueToLabelMap: { [key: string]: string } = useMemo(() => {
    return queryState.items.reduce((all: any, next: any) => {
      all[next?.[relationshipColumnNameForValue as any]] = next?.[relationshipColumnNameForLabel as any];

      return all;
    }, {}) as { [key: string]: string };
  }, [queryState.items.length]);

  const options = useMemo(() => {
    return queryState.items?.map?.((itm: any) => {
      return {
        value: itm?.[relationshipColumnNameForValue as any],
        label: itm?.[relationshipColumnNameForLabel as any],
      };
    });
  }, [queryState.items.length]);

  const onChange = (e: any) => {
    const selectedLabel = e.value || e;
    const selectedValue = optionsLabelToValueMap[selectedLabel];
    if (selectedValue && autoSave) {
      state.executeMutation({ [name]: selectedValue });
    } else {
      state.setItemValue(name, selectedValue);
    }
    setValue(e);
  };

  useEffect(() => {
    if (!queryState.queryState.fetching && state.item?.[name] && state.item?.[name] !== value) {
      const labelForValue = optionsValueToLabelMap[state.item?.[name] as string];

      if (labelForValue) {
        setValue(labelForValue);
      }
    }
  }, [queryState.queryState.fetching, optionsValueToLabelMap]);

  if (!queryState.items?.length) {
    //For some reason Select doesn't update when values changes, so this will ensure the values are there before render and the component works
    return <View></View>;
  }

  return (
    <View style={props.containerStyle}>
      <Autocomplete
        items={options}
        onChangeText={(e: any) => {
          setValue(e);
        }}
        value={value}
        valueLabel={optionsValueToLabelMap[value]}
        onSelect={onChange}
        getItemValue={(itm: any) => itm.value}
        getItemLabel={(itm: any) => itm.label}
      />
    </View>
  );
};

(Input as FunctionComponent & TInput).RadioButtonGroup = function Inputs(props) {
  return <View></View>;
};
(Input as FunctionComponent<IInputProps> & TInput).SelectMany = function Inputs(props) {
  return <View></View>;
};
(Input as FunctionComponent<IInputProps> & TInput).List = function Inputs(props) {
  return <View></View>;
};
(Input as FunctionComponent<IInputProps> & TInput).CheckboxMany = function Inputs(props) {
  return <View></View>;
};

export type InputType = FunctionComponent<IInputProps> & TInput;

export default Input as InputType;

export { Input };
