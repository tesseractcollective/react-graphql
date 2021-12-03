// require('dotenv').config();
import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

//Pull in our Input component instead
import { Input } from '../src'
import { Pressable, View } from 'react-native';
import { useReactGraphql } from '../src'
import HasuraConfig from '../tests/TestHasuraConfig';
import decorators from './decorators';


export default {
  title: 'Inputs/Select',
  component: Input.Select,
  decorators
} as ComponentMeta<typeof Input.Select>;


export const Image: ComponentStory<typeof Input.Select> = () => {
  const dataApi = useReactGraphql(HasuraConfig.posts);
  const mutationState = dataApi.useInsert({});
  const motorcycles = ['bmw', 'honda', 'yamaha']

  return (
    <View>
      <Input.Select placeholder={"type here"} items={motorcycles} state={mutationState} name={"body"} />
    </View>
  );
};
