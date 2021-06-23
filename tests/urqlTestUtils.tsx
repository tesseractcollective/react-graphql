import React, { ReactNode } from "react";

import { OperationType, Provider } from "urql";
import { never, fromValue } from "wonka";

import { getResultFieldName } from "../src/support/graphqlHelpers";

function graphqlExecutorWithValue(value: any, queryTest?: (query: string) => void) {
  return jest.fn(({ query, variables }) => {
    if (queryTest) {
      queryTest(query);
    }
    const resultFieldName = getResultFieldName(query) || 'result';
    return fromValue({
      data: {
        [resultFieldName]: {
          ...value,
          ...variables,
          ...variables.object
        }
      }
    });
  });
}

export function clientWithResultValue(value: any, operation: OperationType, queryTest?: (query: string) => void): any {
  const valueMock = graphqlExecutorWithValue(value, queryTest);
  const neverMock = jest.fn(() => never);
  
  return {
    executeQuery: operation === 'query' ? valueMock : neverMock,
    executeMutation: operation === 'mutation' ? valueMock : neverMock,
    executeSubscription: operation === 'subscription' ? valueMock : neverMock,
  };
}

export function wrapperWithResultValue(value: any, operation: OperationType, queryTest?: (query: string) => void) {
  const mockClient = clientWithResultValue(value, operation, queryTest);
  return ({ children }: { children: ReactNode }) => {
    return <Provider value={mockClient}>{children}</Provider>
  };
}
