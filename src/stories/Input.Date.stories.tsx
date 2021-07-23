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
      {/* Using column reverse is the easiest way to fix popups behind other popups */}
      {/* You can also wrap with Views, and give them all a zIndex where the bigger zIndex is closer to the top */}
      <div style={{flexDirection: 'column-reverse'}}>
        <View >
          <Input.DatePicker format="YYYY-MM-DD" placeholder={'select date'} state={mutationState} name="createdAt"  />
        </View>
        <View >
          {/* This second one is here to test overlaying input boxes where the popup shows up behind the next component */}
          <Input.DatePicker format="YYYY-MM-DD" placeholder={'select date'} state={mutationState} name="createdAt" />
        </View>
      </div>
      <div id="root-portal"> below</div>
    </div>
  );
};
