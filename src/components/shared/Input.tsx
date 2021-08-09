import React, { FunctionComponent, useEffect, useMemo, useState, ReactNode } from 'react';
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
import Radiobox from 'react-native-web-ui-components/Radiobox';
//@ts-ignore
import RNWUITagInput from 'react-native-web-ui-components/TagInput';
//@ts-ignore
import TextInput from 'react-native-web-ui-components/TextInput';
//@ts-ignore
import RNWUIDatePicker from 'react-native-web-ui-components/Datepicker';
//@ts-ignore
import RNWUICheckbox from 'react-native-web-ui-components/Checkbox';
//@ts-ignore
import RNWUIDropzone from 'react-native-web-ui-components/Dropzone';
import { UseInfiniteQueryManyProps, useReactGraphql } from '../../hooks/useReactGraphql';
import HasuraConfig from '../../../tests/TestHasuraConfig';

//TODO: Translations: All labels and placeholders and errors can check against translations

//TODO: P1 Add all propTypes from each react-native-web-ui-component to our matching component, catch them on rest, and spread them back onto RNWUiC

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

const InputBase: FunctionComponent<IInputProps> = function Inputs(props) {
  return <View></View>;
} as InputType;

//TEXT INPUT
export interface IInputTextProps extends TextInputProps {
  state: MutateState;
  name: string;
  disabled?: boolean;
  style?: any;
  multiline?: boolean;
  numberOfLines?: number;
  readonly?: boolean;
  hasError?: boolean;
  className?: string;
  onRef?: (TextInputRef: React.Ref<TextInput>) => void;
}

(InputBase as FunctionComponent<IInputProps> & TInput).Text = function InputText(props) {
  const { state, name, disabled, ...rest } = props;
  //TODO: take in optional Prop for display as text when not focused
  //  > If this is true then we display text until the user clicks on it
  //    > Can style to have a faint border or no border
  //  > Then show the TextInput and focus it sharing that same value
  //TODO: Masking/Validation (min, max, email, phoneNumber)
  //TODO: If is number then up arrow & down arrow supported
  //TODO: Text Prefix & Suffix

  return (
    <TextInput
      value={state.item?.[name]?.toString?.()}
      editable={!disabled}
      onChangeText={(text: string) => state.setItemValue(name, text)}
      {...rest}
    />
  );
};

export interface IInputAutoCompleteProps extends IInputProps {
  items: any[];
  highlightMatches?: boolean;
  autocompleteId?: boolean;
  themeTextStyle?: any;
  themeInputStyle?: any;
  onPress?: () => void;
  text?: string;
  active?: boolean;
  index?: number;
  item?: any;
  style?: any;
  activeStyle?: any;
  numberOfLines?: number;
  // exclude
  // value: any;
}

(InputBase as FunctionComponent<IInputProps> & TInput).AutoComplete = function AutoComplete(props) {
  const { state, name, items, ...rest } = props;

  return (
    <View>
      <Autocomplete
        items={items}
        value={state.item?.[name]?.toString?.()}
        onChangeText={(text: string) => state.setItemValue(name, text)}
        onSelect={(text: string) => state.setItemValue(name, text)}
        {...rest}
      />
    </View>
  );
};

export interface IInputTagInputProps extends IInputProps {
  tags: any[];
  themeInputStyle?: any;
  allowNew?: boolean;
  buildNew?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  readonly?: boolean;
  getItemValue?: () => void;
  style?: any;
  tagStyle?: any;
  tagContainerStyle?: any;
  inputStyle?: any;
  Tag?: String | { [name: string]: any };
  Input?: ReactNode;
  autoFocus?: boolean;
  text?: number | string;
  //exclude
  // value: any;
  // onChange:() => void;
}

(InputBase as FunctionComponent<IInputProps> & TInput).TagInput = function TagInput(props) {
  const { state, name, tags, ...rest } = props;

  const _onChange = (e: any[]) => {
    state.setItemValue(name, e);
  };

  return (
    <View>
      <RNWUITagInput items={tags} value={state.item?.[name]} onChange={_onChange} {...rest} />
    </View>
  );
};

(InputBase as FunctionComponent<IInputProps> & TInput).RichText = function RichText(props) {
  //TODO: P2: update /src/components/web/RichText.tsx
  return null;
};
export interface IInputDateProps extends IInputProps {
  placeholder?: string;
  format?: string;
}

// (InputBase as FunctionComponent<IInputProps> & TInput).Rating = function Rating(
//   props
// ) {
//   //TODO:Jeremy . Does not exist in lib
//   return null;
// };

export interface IInputDateProps extends IInputProps {
  placeholder?: string;
  format?: string;
}

(InputBase as FunctionComponent<IInputProps> & TInput).DatePicker = function DatePicker(props) {
  const { state, name, disabled } = props;

  return (
    <RNWUIDatePicker
      disabled={disabled}
      placeholder={props.placeholder}
      format={props.format || 'MM/DD/YYYY'}
      date={state.item?.[name] || ''}
      onDateChange={(date: any) => state.setItemValue(name, new Date(date))}
    />
  );
};

export interface IInputCheckboxProps extends IInputProps {
  disabled?: boolean;
  text?: string;
}

(InputBase as FunctionComponent<IInputProps> & TInput).Checkbox = function Inputs(props) {
  const { disabled, text, state, name } = props;
  const onPress = (checked: boolean) => {
    state.setItemValue(name, checked);
  };
  return (
    <View>
      <RNWUICheckbox checked={state.item?.[name]} disabled={disabled} text={text} onPress={onPress} />
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

(InputBase as FunctionComponent<IInputProps> & TInput).Image = function Inputs(props) {
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
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'grey',
          cursor: 'pointer',
        }}
        accept={accept ? accept : ['.jpg', '.jpeg', '.svg', '.png', '.gif']}
      >
        <Text style={{ color: 'grey' }}>
          {text ? text : 'Click or drag and drop a file here ' + `(${accept?.join?.(', ')})`}
        </Text>
      </RNWUIDropzone>
    </View>
  );
};

(InputBase as FunctionComponent<IInputProps> & TInput).File = function Inputs(props) {
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
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'grey',
          cursor: 'pointer',
        }}
        accept={accept ? accept : ['.pdf', '.txt', '.doc', '.docx', '.xls', '.xlsx', '.json', '.csv', '.xml']}
      >
        <Text style={{ color: 'grey' }}>
          {text ? text : 'Click or drag and drop a file here ' + `(${accept?.join?.(', ')})`}
        </Text>
      </RNWUIDropzone>
    </View>
  );
};

export interface IInputSelectProps extends IInputProps {
  items: string[];
  placeholder?: string;
}

(InputBase as FunctionComponent<IInputProps> & TInput).Select = function Inputs(props) {
  const { items, state, name, placeholder } = props;

  return (
    <View>
      <Select
        placeholder={placeholder}
        values={items}
        value={state.item?.[name]}
        onChange={(val: string) => state.setItemValue(name, val)}
      />
    </View>
  );
};

export interface SelectViaRelationshipProps extends UseInfiniteQueryManyProps {
  state: MutateState;
  name: string;
  configForRelationship: HasuraDataConfig;
  relationshipColumnNameForLabel: String;
  relationshipColumnNameForValue: String;
  autoSave?: boolean;
  styles?: {
    containerStyle?: ViewProps | Readonly<ViewProps>;
    menuStyle?: ViewProps | Readonly<ViewProps>;
    itemStyle?: ViewProps | Readonly<ViewProps>;
    itemActiveStyle?: ViewProps | Readonly<ViewProps>;
  };
  where?: any;
}

(InputBase as FunctionComponent<IInputProps> & TInput).SelectViaRelationship = function SelectViaRelationship(props) {
  const {
    state,
    name,
    configForRelationship,
    relationshipColumnNameForLabel,
    relationshipColumnNameForValue,
    autoSave,
    styles,
    ...rest
  } = props;

  const [value, setValue] = useState<string>('');

  const dataApi = useReactGraphql(configForRelationship);
  const queryState = dataApi.useInfiniteQueryMany({
    pageSize: 1000,
    ...rest,
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

  //TODO: P3: BONUS: Try to get the popup to show the list of items without having to type first
  

  return (
    <View style={props.styles?.containerStyle}>
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
        itemStyle={props.styles?.itemStyle}
        menuStyle={props.styles?.menuStyle}
        itemActiveStyle={props.styles?.itemActiveStyle}
      />
    </View>
  );
};

export interface IInputRadioButtonGroupProps extends IInputProps {
  items: string[];
}

(InputBase as FunctionComponent & TInput).RadioButtonGroup = function Inputs(props) {
  const { items, state, name } = props;
  const [value, setValue] = useState('');

  useEffect(() => {
    state.setItemValue(name, value);
  }, [value]);

  const renderRadioBox = () =>
    items.map((item) => {
      return <Radiobox checked={value === item} value={value} onPress={() => setValue(item)} text={item} />;
    });

  return <View>{renderRadioBox()}</View>;
};

export interface IInputCheckboxManyProps extends IInputProps {
  items: string[] | { [key: string]: any }[];
}

(InputBase as FunctionComponent<IInputProps> & TInput).CheckboxMany = function Inputs(props) {
  //TODO: Takes in a list of options
  //TODO: connect all currently selected to state
  //TODO: BONUS: Add a prop 'pinSelected?: boolean'
  //When this prop is true the list needs to be sorted to show checked items first and they are pinned so that scrolling doesn't hide them
  const { disabled, items, state, name } = props;
  const [values, setValues] = useState<any>([]);

  //TODO: Delete this before commit
  // //data is always singular, unless it's an array, or an object pretending to be an array.
  // //10,000
  // const bands = [{email: '', bandName: '', artist: ''}, ...];

  // //(10,000 + 9,999, + 9,998....)
  // // const bandCounts = [{artist: '', count: 0}];

  // const bandCounts = {
  // // [bandName]: count
  // };

  // bandCounts[band.artist] //band.artist = 'queen'
  // bandCounts.queen //band.artist = 'queen'

  // //10,000
  // bands.forEach((band) => {
  //   if(bandCounts[band.artist]){
  //     bandCounts[band.artist] += 1;
  //   } else {
  //     bandCounts[band.artist] = 1;
  //   }
  // })

  useEffect(() => {
    state.setItemValue(name, values);
  }, [values]);

  const pushToArr = (item: string | { [key: string]: any }) => {
    if (values.includes(item)) {
      setValues(values.filter((word: any) => word !== item));
    } else {
      setValues([...values, item]);
    }
  };

  const renderCheckboxMany = () =>
    items.map((item: any) => {
      return (
        <RNWUICheckbox
          checked={values.includes(item)}
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

//TODO: P2 - build this JsonList
export interface IJsonListProps extends IInputProps {
  renderItem: (item: { [key: string]: any }, setItemValue: (key: string, value: any) => void) => ReactNode;
  defaultItemValues: { [key: string]: any };
}

{
  /* <Inputs.JsonList
  state={mutateState}
  name={"amounts"}
  renderItem={(item, setItemValue)=> {
    return <div>
      <Select items={amountTypes} value={item.amountType} onSelect={(selected)=> setItemValue('amountType', selected)}/>
    </div>
  }}/> */
}

//TODO: P2 useMutate to support _append, _prepend, and other update options
//TODO: P2 PaginatedTable to support "nestedJsonField" as data prop
//TODO: P2 Inline cell editing in PaginatedTable (Do this as Different component options based on the ones above)
//TODO: PNeededSometime - Big calendar w/ event support
//TODO: PNeededSometime - Add prop to Select for 'asScrollableList' that renders a list of the items in a scrollable view
//TODO: PNeededSometime - TwoLists (Shows two lists, with arrows between to move items left and right)
//TODO: PNeededSometime - Export CSV - Attach to InfiniteQueryList
//TODO: PNeededSometime - Google Location lookup (similar to TheLitas), must include README info for setup (can link to their docs).  What error do they throw if not setup correctly?  Can we catch it and throw a better error?
//TODO: PNeededSometime - PDF 3rd party for web
//TODO: PWhenever - RNWUiC.TimeRangePicker

export type InputType = FunctionComponent<IInputProps> & TInput;

const Input = InputBase as InputType;
export default Input;

export { Input };
