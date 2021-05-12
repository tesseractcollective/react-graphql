import React, { ReactNode } from "react";

import { OperationType, Provider } from "urql";
import { never, fromValue } from "wonka";

import { getResultFieldName } from "../src/support/graphqlHelpers";

function graphqlExecutorWithValue(value: any) {
  return jest.fn(({ query, variables }) => {
    const resultFieldName = getResultFieldName(query) || 'result';
    return fromValue({
      data: {
        [resultFieldName]: {
          ...value,
          ...variables.object
        }
      }
    });
  });
}

export function clientWithResultValue(value: any, operation: OperationType): any {
  const valueMock = graphqlExecutorWithValue(value);
  const neverMock = jest.fn(() => never);
  
  return {
    executeQuery: operation === 'query' ? valueMock : neverMock,
    executeMutation: operation === 'mutation' ? valueMock : neverMock,
    executeSubscription: operation === 'subscription' ? valueMock : neverMock,
  };
}

export function wrapperWithResultValue(value: any, operation: OperationType) {
  const mockClient = clientWithResultValue(value, operation);
  return ({ children }: { children: ReactNode }) => {
    return <Provider value={mockClient}>{children}</Provider>
  };
}
