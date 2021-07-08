// require('dotenv').config();
import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

//Pull in our Input component instead
import Input from '../components/shared/Input';
import { Pressable, View } from 'react-native';
import { useReactGraphql } from '../hooks/useReactGraphql';
import HasuraConfig from '../../tests/TestHasuraConfig';
import decorators from './decorators';
// import { createClient, Provider as UrqlProvider } from 'urql';


export default {
  title: 'Inputs/Checkbox',
  component: Input.Checkbox,
  decorators
} as ComponentMeta<typeof Input.Checkbox>;


export const Form: ComponentStory<typeof Input.Checkbox> = () => {
  // const dataApi = useReactGraphql(HasuraConfig.posts);
  // const mutationState = dataApi.useInsert({});
  //problem with this is they they need their own state
  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(false)
  const [checked3, setChecked3] = useState(false)
  return (
    <View>
      <Input.Checkbox  checked={checked1} disabled={false} text={"Create Story"} onPress={() => setChecked1(!checked1)}/>
      <Input.Checkbox  checked={checked2} disabled={false} text={"Add Props"} onPress={() => setChecked2(!checked2)}/>
      <Input.Checkbox  checked={checked3} disabled={false} text={"Commit Work"} onPress={() => setChecked3(!checked3)}/>
    </View>
  );
};
