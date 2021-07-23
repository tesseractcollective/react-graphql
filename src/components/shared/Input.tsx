import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import {
  View,
  TextInputBase,
  Constructor,
  NativeMethods,
  TimerMixin,
  TextInputProps,
  Text,
  ViewProps,
} from "react-native";
import { MutateState } from "../../hooks/useMutate";
import { HasuraDataConfig } from "../../types/hasuraConfig";
//@ts-ignore
import Select from "react-native-web-ui-components/Select";
//@ts-ignore
import Autocomplete from "react-native-web-ui-components/Autocomplete";
//@ts-ignore
import Radiobox from "react-native-web-ui-components/Radiobox";
//@ts-ignore
import RNWUITagInput from "react-native-web-ui-components/TagInput";
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

export interface IInputProps {
  state: MutateState;
  name: string;
  disabled?: boolean;
}

export interface IInputNumberProps {}
export interface IInputRichTextProps {}

export interface TInput {
  Text: FunctionComponent<IInputTextProps>; //DONE
  AutoComplete: FunctionComponent<IInputAutoCompleteProps>; //DONE
  Checkbox: FunctionComponent<IInputCheckboxProps>; //DONE
  TagInput: FunctionComponent<IInputTagInputProps>;
  DatePicker: FunctionComponent<IInputDateProps>; //DONE
  Image: FunctionComponent<IInputFileProps>; //1 - rnwui
  File: FunctionComponent<IInputFileProps>; //1 - rnwui
  Markdown: FunctionComponent<IInputProps>;
  RichText: FunctionComponent<IInputRichTextProps>; // 1
  Select: FunctionComponent<IInputSelectProps>;
  SelectViaRelationship: FunctionComponent<SelectViaRelationshipProps>;
  RadioButtonGroup: FunctionComponent<IInputRadioButtonGroupProps>;
  CheckboxMany: FunctionComponent<IInputCheckboxManyProps>;
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

export interface IInputAutoCompleteProps extends IInputProps {
  items: any[];
}

(Input as FunctionComponent<IInputProps> & TInput).AutoComplete =
  function AutoComplete(props) {
    const { state, name, items } = props;
    const [value, setValue] = useState<string | undefined>();

    useEffect(() => {
      state.setItemValue(name, value);
    }, [value]);

    return (
      <View>
        <Autocomplete
          items={items}
          value={value}
          onChangeText={setValue}
          onSelect={setValue}
        />
      </View>
    );
  };

export interface IInputTagInputProps extends IInputProps {
  tags: string[];
}

(Input as FunctionComponent<IInputProps> & TInput).TagInput = function TagInput(
  props
) {
  const [value, setValue] = useState("");
  const { state, name, tags } = props;
  //selected tags should probably be pushed up into a new array
  useEffect(() => {
    state.setItemValue(name, value);
  }, [value]);

  return (
    <View>
      <RNWUITagInput
        items={tags}
        value={value}
        onChange={setValue}
        onSelect={setValue}
      />
    </View>
  );
};

(Input as FunctionComponent<IInputProps> & TInput).RichText = function RichText(
  props
) {
  //TODO: P2: update /src/components/web/RichText.tsx
  return null;
};
export interface IInputDateProps extends IInputProps {
  placeholder?: string;
  format?: string;
}

(Input as FunctionComponent<IInputProps> & TInput).Rating = function Rating(
  props
) {
  //TODO:Jeremy . Does not exist in lib
  return null;
};

export interface IInputDateProps extends IInputProps {
  placeholder?: string;
  format?: string;
}

(Input as FunctionComponent<IInputProps> & TInput).DatePicker =
  function DatePicker(props) {
    const { state, name, disabled } = props;

    return (
      <RNWUIDatePicker
        disabled={disabled}
        placeholder={props.placeholder}
        format={props.format}
        date={state.item?.[name] || ""}
        onDateChange={(date: any) => state.setItemValue(name, new Date(date))}
      />
    );
  };

export interface IInputCheckboxProps extends IInputProps {
  disabled?: boolean;
  text?: string;
}

(Input as FunctionComponent<IInputProps> & TInput).Checkbox = function Inputs(
  props
) {
  const { disabled, text, state, name } = props;
  const onPress = (checked: boolean) => {
    state.setItemValue(name, checked);
  };
  return (
    <View>
      <RNWUICheckbox
        checked={state.item?.[name]}
        disabled={disabled}
        text={text}
        onPress={onPress}
      />
    </View>
  );
};
export interface IInputFileProps extends IInputProps {
  onDrop?: (file: { type: String; name: String }) => void;
  text?: string;
  accept?: string[];
  // style: StylePropType,  //TODO convert to typescript and include optionally
  // cameraText: PropTypes.string,
  // albumText: PropTypes.string,
  // fileText: PropTypes.string,
  // cancelText: PropTypes.string,
}

(Input as FunctionComponent<IInputProps> & TInput).Image = function Inputs(
  props
) {
  const { onDrop, text, accept, state, name } = props;
  const _onDrop = (file: { type: String; name: String }) => {
    if (name) {
      state.setItemValue(name, file.name);
    }
    onDrop?.(file);
  };

  return (
    <View>
      <RNWUIDropzone
        onDrop={_onDrop}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "grey",
          cursor: "pointer",
        }}
        accept={accept ? accept : [".jpg", ".jpeg", ".svg", ".png", ".gif"]}
      >
        <Text style={{ color: "grey" }}>
          {text ? text : "Click or drag and drop a file here"}
        </Text>
      </RNWUIDropzone>
    </View>
  );
};

(Input as FunctionComponent<IInputProps> & TInput).File = function Inputs(
  props
) {
  const { onDrop, text, accept, state, name } = props;
  const _onDrop = (file: { type: String; name: String }) => {
    if (name) {
      state.setItemValue(name, file.name);
    }
    onDrop?.(file);
  };

  return (
    <View>
      <RNWUIDropzone
        onDrop={_onDrop}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "grey",
          cursor: "pointer",
        }}
        accept={
          accept
            ? accept
            : [
                ".pdf",
                ".txt",
                ".doc",
                ".docx",
                ".xls",
                ".xlsx",
                ".json",
                ".csv",
                ".xml",
              ]
        }
      >
        <Text style={{ color: "grey" }}>
          {text ? text : "Click or drag and drop a file here"}
        </Text>
      </RNWUIDropzone>
    </View>
  );
};

export interface IInputSelectProps extends IInputProps {
  items: string[];
  placeholder?: string;
}

(Input as FunctionComponent<IInputProps> & TInput).Select = function Inputs(
  props
) {
  const { items, state, name, placeholder } = props;
  const [value, setValue] = useState("");

  useEffect(() => {
    state.setItemValue(name, value);
  }, [value]);

  return (
    <View>
      <Select
        placeholder={placeholder}
        values={items}
        value={value}
        onChange={setValue}
      />
    </View>
  );
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

(Input as FunctionComponent<IInputProps> & TInput).SelectViaRelationship =
  function SelectViaRelationship(props) {
    const {
      state,
      name,
      configForRelationship,
      relationshipColumnNameForLabel,
      relationshipColumnNameForValue,
      autoSave,
    } = props;

    const [value, setValue] = useState<string>("");

    const dataApi = useReactGraphql(configForRelationship);
    const queryState = dataApi.useInfiniteQueryMany({
      pageSize: 1000,
    });

    const optionsLabelToValueMap: { [key: string]: string } = useMemo(() => {
      return queryState.items.reduce((all: any, next: any) => {
        all[next?.[relationshipColumnNameForLabel as any]] =
          next?.[relationshipColumnNameForValue as any];
        return all;
      }, {}) as { [key: string]: string };
    }, [queryState.items.length]);

    const optionsValueToLabelMap: { [key: string]: string } = useMemo(() => {
      return queryState.items.reduce((all: any, next: any) => {
        all[next?.[relationshipColumnNameForValue as any]] =
          next?.[relationshipColumnNameForLabel as any];

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
      if (
        !queryState.queryState.fetching &&
        state.item?.[name] &&
        state.item?.[name] !== value
      ) {
        const labelForValue =
          optionsValueToLabelMap[state.item?.[name] as string];

        if (labelForValue) {
          setValue(labelForValue);
        }
      }
    }, [queryState.queryState.fetching, optionsValueToLabelMap]);

    if (!queryState.items?.length) {
      //For some reason Select doesn't update when values changes, so this will ensure the values are there before render and the component works
      return <View></View>;
    }

    //TODO: P3: BONUS: Try to get the popup to show the list of items without having to type first

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

export interface IInputRadioButtonGroupProps extends IInputProps {
  items: string[];
}

(Input as FunctionComponent & TInput).RadioButtonGroup = function Inputs(
  props
) {
  //TODO: Takes in a list of options
  //TODO: When any are checked/selected uncheck all others
  //TODO: connect currently selected to state
  const { items, state, name } = props;
  const [value, setValue] = useState("");

  useEffect(() => {
    state.setItemValue(name, value);
  }, [value]);

  const renderRadioBox = () =>
    items.map((item) => {
      return (
        <Radiobox
          checked={value === item}
          value={value}
          onPress={() => setValue(item)}
          text={item}
        />
      );
    });

  return <View>{renderRadioBox()}</View>;
};

export interface IInputCheckboxManyProps extends IInputProps {
  items: string[];
}

(Input as FunctionComponent<IInputProps> & TInput).CheckboxMany =
  function Inputs(props) {
    //TODO: Takes in a list of options
    //TODO: connect all currently selected to state
    //TODO: BONUS: Add a prop 'pinSelected?: boolean'
    //When this prop is true the list needs to be sorted to show checked items first and they are pinned so that scrolling doesn't hide them
    const { disabled, items, state, name } = props;
    const [value, setValue] = useState<any>([]);

    useEffect(() => {
      state.setItemValue(name, value);
    }, [value]);

    const pushToArr = (item: string) => {
      let index = value.indexOf(item);
      if (value.includes(item)) {
        setValue(value.filter((word: any, i: number) => i !== index));
      } else {
        setValue([...value, item]);
      }
    };
    const renderCheckboxMany = () =>
      items.map((item) => {
        return (
          <RNWUICheckbox
            checked={value.includes(item)}
            disabled={disabled}
            text={item}
            onPress={() => {
              pushToArr(item);
            }}
          />
        );
      });

    return <View>{renderCheckboxMany()}</View>;
  };

export type InputType = FunctionComponent<IInputProps> & TInput;

export default Input as InputType;

export { Input };
