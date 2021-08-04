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
  title: 'Inputs/File',
  component: Input.File,
  decorators
} as ComponentMeta<typeof Input.File>;


export const Form: ComponentStory<typeof Input.File> = () => {
  // const dataApi = useReactGraphql(HasuraConfig.posts);
  // const mutationState = dataApi.useInsert({});
  const dataApi = useReactGraphql(HasuraConfig.posts);
  const mutationState = dataApi.useInsert({});
  return (
    <View>
      <Input.File state={mutationState}
        name="files" onDrop={(file) => console.log(file)} />
    </View>
  );
};
