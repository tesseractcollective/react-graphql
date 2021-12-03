import { addDecorator } from '@storybook/react';
// import { urqlDecorator } from '@urql/storybook-addon';

// addDecorator(urqlDecorator);


export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}