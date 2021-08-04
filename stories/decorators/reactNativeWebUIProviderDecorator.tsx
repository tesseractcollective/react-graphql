import React from 'react';
import { UIProvider } from 'react-native-web-ui-components';
import { StyleSheet } from 'react-native';

export const theme = {
  input: {
    focused: StyleSheet.create({
      border: {
        borderColor: 'yellow',
      },
    }),
  },
};

export function reactNativeWebUIProviderDecorator() {
  return (Story) => {
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
  };
}
