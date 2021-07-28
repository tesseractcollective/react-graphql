import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { Text, View } from 'react-native';
import ENV from '../../.env.js';
import HasuraConfig from '../../tests/TestHasuraConfig';
import Input from '../components/shared/Input';
import { useReactGraphql } from '../hooks/useReactGraphql';
import decorators from './decorators';

export default {
  title: 'Inputs/SelectViaRelationship',
  component: Input.SelectViaRelationship,
  decorators,
} as ComponentMeta<typeof Input.SelectViaRelationship>;

export const Select: ComponentStory<typeof Input.SelectViaRelationship> = () => {
  const dataApi = useReactGraphql(HasuraConfig.posts);
  const insertPostState = dataApi.useInsert({});

  return (
    <View style={{ height: '200px' }}>
      <Input.SelectViaRelationship
        state={insertPostState}
        name="group"
        configForRelationship={HasuraConfig.groups}
        relationshipColumnNameForValue="name"
        relationshipColumnNameForLabel="name"
      />
      <Text>{JSON.stringify(insertPostState.item)}</Text>
    </View>
  );
};

export const WithValue: ComponentStory<typeof Input.SelectViaRelationship> = () => {
  const dataApi = useReactGraphql(HasuraConfig.posts);
  const insertPostState = dataApi.useInsert({
    initialItem: { group: 'Denver' },
  });

  return (
    <View style={{ height: '200px' }}>
      <Input.SelectViaRelationship
        state={insertPostState}
        name="group"
        configForRelationship={HasuraConfig.groups}
        relationshipColumnNameForValue="name"
        relationshipColumnNameForLabel="name"
      />
      <Text>{JSON.stringify(insertPostState.item)}</Text>
    </View>
  );
};
