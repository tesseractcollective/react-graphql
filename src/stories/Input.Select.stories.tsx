import ENV from '../../.env';
import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

//Pull in our Input component instead
import Input from '../components/shared/Input';
import { StyleSheet, View } from 'react-native';
import { useReactGraphql } from '../hooks/useReactGraphql';
import HasuraConfig from '../../tests/TestHasuraConfig';
import { UIProvider } from 'react-native-web-ui-components';
import { createClient, Provider as UrqlProvider } from 'urql';

const hasuraUrl = ENV.STORYBOOK_HASURA_URL;

const theme = {
  input: {
    focused: StyleSheet.create({
      border: {
        borderColor: 'yellow',
      },
    }),
  },
};

export default {
  title: 'Inputs/SelectViaRelationship',
  component: Input.SelectViaRelationship,
  decorators: [
    (Story) => {
      return (
        <UIProvider
          theme={theme}
          history={{
            location: { pathname: '/hi' },
            push: () => {},
            replace: () => {},
          }}
        >
          <Story />
        </UIProvider>
      );
    },

    (Story) => {
      const [client, setClient] = useState(() =>
        createClient({
          url: hasuraUrl,
          fetchOptions: () => {
            return {
              headers: {
                [ENV.STORYBOOK_HAUSRA_AUTH_KEYNAME]: ENV.STORYBOOK_HASURA_AUTH_VALUE,
              },
            };
          },
        }),
      );
      return (
        <UrqlProvider value={client}>
          <Story />
        </UrqlProvider>
      );
    },
  ],
} as ComponentMeta<typeof Input.SelectViaRelationship>;

export const Form: ComponentStory<typeof Input.SelectViaRelationship> = () => {
  const dataApi = useReactGraphql(HasuraConfig.posts);
  const insertPostState = dataApi.useInsert({});

  return (
    <View style={{ height: '200px' }}>
      <Input.SelectViaRelationship
        state={insertPostState}
        name="group"
        configForRelationship={HasuraConfig.groups}
        relationshipColumnName="name"
      />
      {JSON.stringify(insertPostState.item)}
    </View>
  );
};
