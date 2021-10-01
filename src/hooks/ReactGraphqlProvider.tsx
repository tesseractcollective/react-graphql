import React, { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Client, Provider as UrqlProvider } from 'urql';

/** 
  @param client an Urql Client to prevent duplicate copies of urql being used.  
*/
export type IReactGraphqlProviderProps = {
  client: Client;
};

export const ReactGraphqlProvider: FunctionComponent<IReactGraphqlProviderProps> = function ReactGraphqlProvider(
  props,
) {
  return <UrqlProvider value={props.client}>{props.children}</UrqlProvider>;
};
