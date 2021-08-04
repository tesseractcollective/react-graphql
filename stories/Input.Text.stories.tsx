// require('dotenv').config();
import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

//Pull in our Input component instead
import { Input } from '../src'
import { Pressable, View } from 'react-native';
import { useReactGraphql } from '../src'
import HasuraConfig from '../tests/TestHasuraConfig';
// import { createClient, Provider as UrqlProvider } from 'urql';
import decorators from './decorators';

export default {
  title: 'Inputs/Text',
  component: Input.Text,
  decorators,
} as ComponentMeta<typeof Input.Text>;

const StoryComponent: ComponentStory<typeof Input.Text> = (args) => <Input.Text {...args} />;

export const Form: ComponentStory<typeof Input.Text> = () => {
  const dataApi = useReactGraphql(HasuraConfig.posts);
  const mutationState = dataApi.useInsert({});

  return (
    <View>
      <Input.Text placeholder="First Name" state={mutationState} name="body" />
      <Input.Text placeholder="Create At" state={mutationState} name="createdAt" />
      {JSON.stringify(mutationState.item)}
      <Pressable onPress={() => mutationState.executeMutation()} >Save</Pressable>
    </View>
  );
};
