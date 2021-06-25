import React, { FunctionComponent } from 'react';
import { TextInput, View } from 'react-native';

//TODO: Translations: All labels and placeholders and errors can check against translations

export interface IInputProps {}
export interface IInputTextProps {}
export interface IInputNumberProps {}
export interface IInputRichTextProps {}

export interface TInput {
  Text: FunctionComponent<IInputTextProps>;
  Number: FunctionComponent<IInputNumberProps>;
  Checkbox: FunctionComponent<IInputProps>;
  Date: FunctionComponent<IInputProps>;
  DateTime: FunctionComponent<IInputProps>;
  Image: FunctionComponent<IInputProps>;
  File: FunctionComponent<IInputProps>;
  Markdown: FunctionComponent<IInputProps>;
  Password: FunctionComponent<IInputProps>;
  RichText: FunctionComponent<IInputRichTextProps>;
  Select: FunctionComponent<IInputProps>;
  SelectViaRelationship: FunctionComponent<IInputProps>;
  RadioButtonGroup: FunctionComponent<IInputProps>;
  SelectMany: FunctionComponent<IInputProps>;
  List: FunctionComponent<IInputProps>;
  CheckboxMany: FunctionComponent<IInputProps>;
}

const Input: FunctionComponent<IInputProps> = function Inputs(props) {
  return <View></View>;
};

(Input as FunctionComponent<IInputProps> & TInput).Text = function Inputs(props) {
  return <View>
    <TextInput placeholder="Input"/>
  </View>;
};

(Input as FunctionComponent<IInputProps> & TInput).RichText = function Inputs(props) {
  return <View></View>;
};

(Input as FunctionComponent<IInputProps> & TInput).Date = function Inputs(props) {
  return <View></View>;
};
(Input as FunctionComponent<IInputProps> & TInput).DateTime = function Inputs(props) {
  return <View></View>;
};

(Input as FunctionComponent<IInputProps> & TInput).Number = function Inputs(props) {
  return <View></View>;
};

(Input as FunctionComponent<IInputProps> & TInput).Checkbox = function Inputs(props) {
  return <View></View>;
};


(Input as FunctionComponent<IInputProps> & TInput).Image = function Inputs(props) {
  return <View></View>;
};
(Input as FunctionComponent<IInputProps> & TInput).File = function Inputs(props) {
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
(Input as FunctionComponent<IInputProps> & TInput).SelectViaRelationship = function Inputs(props) {
  return <View></View>;
};

(Input as FunctionComponent<IInputProps> & TInput).RadioButtonGroup = function Inputs(props) {
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

export default Input as FunctionComponent<IInputProps> & TInput;
