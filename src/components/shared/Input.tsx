import React, { FunctionComponent, useEffect, useMemo } from 'react';
import { View, TextInputBase, Constructor, NativeMethods, TimerMixin, TextInputProps, Text } from 'react-native';
import { MutateState } from '../../hooks/useMutate';
import { HasuraDataConfig } from '../../types/hasuraConfig';
//@ts-ignore
import Select from 'react-native-web-ui-components/Select';
//@ts-ignore
import TextInput from 'react-native-web-ui-components/TextInput';
//@ts-ignore
import RNWUIDatePicker from 'react-native-web-ui-components/Datepicker';
import { useReactGraphql } from '../../hooks/useReactGraphql';
import HasuraConfig from '../../../tests/TestHasuraConfig';

//TODO: Translations: All labels and placeholders and errors can check against translations

export interface IInputProps {}

export interface IInputNumberProps {}
export interface IInputRichTextProps {}

export interface TInput {
  Text: FunctionComponent<IInputTextProps>; //DONE
  Number: FunctionComponent<IInputNumberProps>;
  Checkbox: FunctionComponent<IInputProps>;  
  DatePicker: FunctionComponent<IInputProps>; //1 - rnwui
  Image: FunctionComponent<IInputProps>; //1 - rnwui
  File: FunctionComponent<IInputProps>; //1 - rnwui
  Markdown: FunctionComponent<IInputProps>;
  Password: FunctionComponent<IInputProps>; 
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

(Input as FunctionComponent<IInputProps> & TInput).DatePicker = function DatePicker(props) {
  //TODO: P1: Implement RNWeb-UI-Components .Datepicker
  // const [startDate, setStartDate] = useState();

  return (
    <View>
      <RNWUIDatePicker
      // selected={new Date()} onChange={(date) => setStartDate(date)}
      />
    </View>
  );
};

(Input as FunctionComponent<IInputProps> & TInput).Number = function Inputs(props) {
  //Might be able to do this through just the TextInputComponent changing keyboard to number
  return <View></View>;
};

(Input as FunctionComponent<IInputProps> & TInput).Checkbox = function Inputs(props) {
  //RNWeb-UI-Components
  return <View></View>;
};

(Input as FunctionComponent<IInputProps> & TInput).Image = function Inputs(props) {
  //Uplaod image??
  return <View></View>;
};
(Input as FunctionComponent<IInputProps> & TInput).File = function Inputs(props) {
  //Uplaod File?
  return <View></View>;
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

  const dataApi = useReactGraphql(configForRelationship);
  const queryState = dataApi.useInfiniteQueryMany({
    pageSize: 1000,
  });

  const options = useMemo(() => {
    return queryState.items?.map?.((itm: any) => itm?.[relationshipColumnNameForValue as any])|| [];
  }, [queryState.items.length]);

  const labels = useMemo(() => {
    return queryState.items?.map?.((itm: any) => itm?.[relationshipColumnNameForLabel as any]) || [];
  }, [queryState.items?.length]);

  if (!queryState.items?.length) {
    //For some reason Select doesn't update when values changes, so this will ensure the values are there before render and the component works
    return <View></View>;
  }

  const onChange = (e: any) => {
    const nextVal = e.value || e;    
    if (nextVal && autoSave) {
      state.executeMutation({ [name]: nextVal });
    } else {
      state.setItemValue(name, nextVal);
    }
  };

  return (
    <View>
      <Select style={{}} values={options} fitContent onChange={onChange} value={state.item?.[name]} labels={labels} />
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
