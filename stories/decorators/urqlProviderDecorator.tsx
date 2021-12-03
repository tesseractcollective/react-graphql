import ENV from '../../.env.js';
import React, { useState } from 'react';
import { createClient, Provider as UrqlProvider } from 'urql';


export const hasuraUrl = ENV.STORYBOOK_HASURA_URL;

export function urqlProviderDecorator() {
  return (Story) => {
    const [client, setClient] = useState(() => createClient({
      url: hasuraUrl,
      fetchOptions: () => {
        return {
          headers: {
            [ENV.STORYBOOK_HAUSRA_AUTH_KEYNAME]: ENV.STORYBOOK_HASURA_AUTH_VALUE,
          },
        };
      },
    })
    );
    return (
      <UrqlProvider value={client}>
        <Story />
      </UrqlProvider>
    );
  };
}
