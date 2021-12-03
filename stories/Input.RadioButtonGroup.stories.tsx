// require('dotenv').config();
import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

//Pull in our Input component instead
import { Input } from '../src'
import { Pressable, View } from 'react-native';
import { useReactGraphql } from '../src'
import HasuraConfig from '../tests/TestHasuraConfig';
import decorators from './decorators';
// import { createClient, Provider as UrqlProvider } from 'urql';


export default {
  title: 'Inputs/RadioButtonGroup',
  component: Input.RadioButtonGroup,
  decorators
} as ComponentMeta<typeof Input.RadioButtonGroup>;


export const RadioButtonGroup: ComponentStory<typeof Input.RadioButtonGroup> = () => {
  const dataApi = useReactGraphql(HasuraConfig.posts);
  const mutationState = dataApi.useInsert({});
  return (
    <View>
      <Input.RadioButtonGroup state={mutationState} name={"body"} items={['cat', 'dog', 'cow']}/>
    </View>
  );
};
