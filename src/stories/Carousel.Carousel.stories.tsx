// require('dotenv').config();
import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

//Pull in our Input component instead
import Carousel from '../components/shared/Carousel';
import { Pressable, View } from 'react-native';
import { useReactGraphql } from '../hooks/useReactGraphql';
import HasuraConfig from '../../tests/TestHasuraConfig';
import decorators from './decorators';
// import { createClient, Provider as UrqlProvider } from 'urql';


export default {
  title: 'Carousel/Carousel',
  component: Carousel.Carousel,
  decorators
} as ComponentMeta<typeof Carousel.Carousel>;


export const Form: ComponentStory<typeof Carousel.Carousel> = () => {
  const dataApi = useReactGraphql(HasuraConfig.posts);
  const mutationState = dataApi.useInsert({});
  return (
    <View>
      <Carousel.Carousel state={mutationState} name="body"/>
    </View>
  );
};
