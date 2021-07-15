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
  title: 'Inputs/DatePicker',
  component: Input.DatePicker,
  decorators,
} as ComponentMeta<typeof Input.DatePicker>;

export const Form: ComponentStory<typeof Input.DatePicker> = () => {
  const dataApi = useReactGraphql(HasuraConfig.posts);
  const mutationState = dataApi.useInsert({});

  return (
    <div>
      <div >
        <View>
          <Input.DatePicker format="YYYY-MM-DD" placeholder={'select date'} state={mutationState} name="body"  />
        </View>
        <View >
          <Input.DatePicker format="YYYY-MM-DD" placeholder={'select date'} state={mutationState} name="body" />
        </View>
      </div>
      <div id="root-portal"> below</div>
    </div>
  );
};
