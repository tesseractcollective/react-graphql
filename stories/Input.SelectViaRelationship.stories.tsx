import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { Text, View } from 'react-native';
import HasuraConfig from '../tests/TestHasuraConfig';
import { Input } from '../src';
import { useReactGraphql } from '../src';
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

export const WithWhereClause: ComponentStory<typeof Input.SelectViaRelationship> = () => {
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
        where={{ name: { _like: '%en%' } }}
      />
      <Text>{JSON.stringify(insertPostState.item)}</Text>
    </View>
  );
};
