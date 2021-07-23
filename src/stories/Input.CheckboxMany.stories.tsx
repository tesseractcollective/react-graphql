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
  title: 'Inputs/CheckboxMany',
  component: Input.CheckboxMany,
  decorators
} as ComponentMeta<typeof Input.CheckboxMany>;


export const CheckboxMany: ComponentStory<typeof Input.CheckboxMany> = () => {
  const dataApi = useReactGraphql(HasuraConfig.posts);
  const mutationState = dataApi.useInsert({});
  return (
    <View>
      <Input.CheckboxMany state={mutationState} name={"body"} items={['cat', 'dog', 'cow']}/>
    </View>
  );
};
