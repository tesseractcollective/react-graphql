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
  title: 'Inputs/Image',
  component: Input.Image,
  decorators
} as ComponentMeta<typeof Input.Image>;


export const Image: ComponentStory<typeof Input.Image> = () => {
  const dataApi = useReactGraphql(HasuraConfig.posts);
  const mutationState = dataApi.useInsert({});
  return (
    <View>
      <Input.Image state={mutationState}
        name="files" onDrop={(file) => console.log(file)} />
    </View>
  );
};
