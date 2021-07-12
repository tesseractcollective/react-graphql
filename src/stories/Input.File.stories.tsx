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
  title: 'Inputs/File',
  component: Input.File,
  decorators
} as ComponentMeta<typeof Input.File>;


export const Form: ComponentStory<typeof Input.File> = () => {
  // const dataApi = useReactGraphql(HasuraConfig.posts);
  // const mutationState = dataApi.useInsert({});
  const [startDate, setStartDate] = useState<Date | null>(null)
  return (
    <View>
      <Input.File onDrop={(file) => console.log(file)} />
    </View>
  );
};
