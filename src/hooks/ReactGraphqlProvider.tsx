import React, { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Client, Provider as UrqlProvider } from 'urql';
//@ts-ignore
import UIProvider from 'react-native-web-ui-components/UIProvider';

export type IReactGraphqlProviderProps = {
  client: Client;
};

export const ReactGraphqlProvider: FunctionComponent<IReactGraphqlProviderProps> = function ReactGraphqlProvider(
  props,
) {
  return (
    <UIProvider
      theme={theme}
      history={{
        location: { pathname: '/hi' },
        push: () => {},
        replace: () => {},
      }}
    >
      <UrqlProvider value={props.client}>{props.children}</UrqlProvider>
    </UIProvider>
  );
};

export const theme = {
  input: {
    focused: StyleSheet.create({
      border: {
        borderColor: 'yellow',
      },
    }),
  },
};
