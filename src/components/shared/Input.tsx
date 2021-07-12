import React, { FunctionComponent, useEffect, useMemo } from 'react';
import { View, TextInputBase, Constructor, NativeMethods, TimerMixin, TextInputProps, Text, ViewProps } from 'react-native';
import { MutateState } from '../../hooks/useMutate';
import { HasuraDataConfig } from '../../types/hasuraConfig';
//@ts-ignore
import Select from "react-native-web-ui-components/Select";
//@ts-ignore
import TextInput from "react-native-web-ui-components/TextInput";
//@ts-ignore
import RNWUIDatePicker from "react-native-web-ui-components/Datepicker";
//@ts-ignore
import RNWUICheckbox from "react-native-web-ui-components/Checkbox";
//@ts-ignore
import RNWUIDropzone from "react-native-web-ui-components/Dropzone";
import { useReactGraphql } from "../../hooks/useReactGraphql";
import HasuraConfig from "../../../tests/TestHasuraConfig";

//TODO: Translations: All labels and placeholders and errors can check against translations

export interface IInputProps {}

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

(Input as FunctionComponent<IInputProps> & TInput).Text = function InputText(
  props
) {
  const { state, name, disabled } = props;

  return (
    <View>
      <TextInput
        placeholder={props.placeholder}
        value={state.item?.[name]?.toString()}
        editable={!disabled}
        onChangeText={(text: string) =>
          props.state.setItemValue(props.name, text)
        }
      />
    </View>
  );
};

(Input as FunctionComponent<IInputProps> & TInput).RichText = function RichText(
  props
) {
  //TODO: P2: Need to find react-native-web compatible rich text editor, OR a rich text editor for React and react-native separately
  return <View></View>;
};

export interface IInputDateProps {
  startDate: Date | null;
  setStartDate: (date: Date) => void;
  placeholder?: string;
  format?: string;
}

(Input as FunctionComponent<IInputProps> & TInput).DatePicker =
  function DatePicker(props) {
    const { startDate, setStartDate } = props;

    return (
      <View>
        <RNWUIDatePicker
          placeholder={props.placeholder}
          format={props.format}
          date={startDate}
          onDateChange={(date: any) => setStartDate(new Date(date))}
        />
      </View>
    );
  };

(Input as FunctionComponent<IInputProps> & TInput).Number = function Inputs(
  props
) {
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

(Input as FunctionComponent<IInputProps> & TInput).Checkbox = function Inputs(
  props
) {
  const { checked, disabled, text, value, onPress } = props;
  //should state for check be here so they each have their own?
  return (
    <View>
      <RNWUICheckbox
        checked={checked}
        disabled={disabled}
        text={text}
        value={value}
        onPress={onPress}
      />
    </View>
  );
};

(Input as FunctionComponent<IInputProps> & TInput).Image = function Inputs(
  props
) {
  //Uplaod image??
  return <View></View>;
};

export interface IInputFileProps {
  onDrop: (file: any) => void;
  text?: string;
}

(Input as FunctionComponent<IInputProps> & TInput).File = function Inputs(
  props
) {
  const { onDrop, text } = props;
  return (
    <View>
      <RNWUIDropzone
        onDrop={onDrop}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "grey",
          cursor: "pointer"
        }}
      >
        <Text style={{ color: "grey" }}>
          {text ? text : "Click or drag and drop a file here"}
        </Text>
      </RNWUIDropzone>
    </View>
  );
};
(Input as FunctionComponent<IInputProps> & TInput).Markdown = function Inputs(
  props
) {
  return <View></View>;
};
(Input as FunctionComponent<IInputProps> & TInput).Password = function Inputs(
  props
) {
  return <View></View>;
};

(Input as FunctionComponent<IInputProps> & TInput).Select = function Inputs(
  props
) {
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

  const columnValue = state.item?.[name];
  const matchingOptionIdx = options.indexOf(columnValue);
  const value = matchingOptionIdx >= 0 ? options[matchingOptionIdx] : undefined;

  return (
    <View style={props.containerStyle}>
      <Select menuStyle={props.menuStyle} values={options} fitContent onChange={onChange} value={value} labels={labels} />
    </View>
  );
};

    return (
      <View>
        <Select
          style={{}}
          values={options}
          fitContent
          onChange={onChange}
          value={state.item?.[name]}
          labels={labels}
        />
      </View>
    );
  };

(Input as FunctionComponent & TInput).RadioButtonGroup = function Inputs(
  props
) {
  return <View></View>;
};
(Input as FunctionComponent<IInputProps> & TInput).SelectMany = function Inputs(
  props
) {
  return <View></View>;
};
(Input as FunctionComponent<IInputProps> & TInput).List = function Inputs(
  props
) {
  return <View></View>;
};
(Input as FunctionComponent<IInputProps> & TInput).CheckboxMany =
  function Inputs(props) {
    return <View></View>;
  };

export type InputType = FunctionComponent<IInputProps> & TInput;

export default Input as InputType;
