import React, { FunctionComponent } from 'react';
import { Client, Provider as UrqlProvider } from 'urql';

export type IReactGraphqlProviderProps = {
  client: Client;
}

export const ReactGraphqlProvider: FunctionComponent<IReactGraphqlProviderProps> = function ReactGraphqlProvider(props) {
  return <UrqlProvider value={props.client}>{props.children}</UrqlProvider>;
};