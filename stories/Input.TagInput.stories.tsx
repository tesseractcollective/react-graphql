// require('dotenv').config();
import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

//Pull in our Input component instead
import { Input } from '../src';
import { Pressable, View } from 'react-native';
import { useReactGraphql } from '../src';
import HasuraConfig from '../tests/TestHasuraConfig';
import decorators from './decorators';


export default {
  title: 'Inputs/TagInput',
  component: Input.TagInput,
  decorators
} as ComponentMeta<typeof Input.TagInput>;


export const Image: ComponentStory<typeof Input.TagInput> = () => {
  const dataApi = useReactGraphql(HasuraConfig.posts);
  const mutationState = dataApi.useInsert({});
  const motorcycles = ['bmw', 'honda', 'yamaha']

  return (
    <View>
      <Input.TagInput tags={motorcycles} state={mutationState} name={"body"} />
    </View>
  );
};
