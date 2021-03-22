import React, { useEffect, useMemo, useState } from 'react';
import { OperationContext, useMutation } from 'urql';

interface IUseMutateProps {
  sharedConfig: HasuraDataConfig;
  middleware: MutationMiddleware[];
  initialVariables?: IJsonObject;
}

export default function useMutate<T extends IJsonObject>(props: IUseMutateProps): any {
  const { sharedConfig, middleware, initialVariables } = props;
  //MutationConfig is what we internally refer to the middlewareState as
  const [objectVariables, setObjectVariables] = useState<{ [key: string]: any }>(initialVariables ?? {});

  //Guards
  if (!sharedConfig || !middleware?.length) {
    throw new Error('sharedConfig and at least one middleware required');
  }

  //Setup the initial mutation Config so it's for sure ready before we get to urql
  const mutationCfg: MutationPostMiddlewareState = useMemo(() => {
    let _mutationCfg;
    const _tmp = middleware.reduce(
      (val, next: MutationMiddleware) => {
        const mState: MutationPostMiddlewareState = next(val, sharedConfig);
        let newState = {};
        if (val) Object.assign(newState, val);
        Object.assign(newState, mState);
        return newState as MutationPostMiddlewareState;
      },
      {
        variables: objectVariables,
      } as MutationPreMiddlewareState,
    );

    _mutationCfg = _tmp as MutationPostMiddlewareState;

    return _mutationCfg;
  }, [sharedConfig, middleware, objectVariables]);

  //The mutation
  const [mutationResult, executeMutation] = useMutation(mutationCfg?.mutation);
  const data = mutationResult.data?.[mutationCfg.operationName];
  const resultItem = data.data?.[mutationCfg.operationName];

  //Handling variables
  const setVariable = (key: string, value: any) => {
    setObjectVariables({
      ...objectVariables,
      [key]: value,
    });
  };

  const setVariables = (variables: { [key: string]: any }) => {
    setObjectVariables({
      ...objectVariables,
      ...variables,
    });
  };

  //Return values
  return {
    data,
    resultItem,
    executeMutation: (_variables?: IJsonObject, context?: Partial<OperationContext>) => {
      //create combined variables from paassed in ones and existing
      let variables = _variables
        ? {
            ...objectVariables,
            ..._variables,
          }
        : objectVariables;
      if (_variables) {
        //If variables were passed in then save the new combined variables
        setObjectVariables(variables);
      }
      executeMutation(variables, context);
    },
    setVariable,
    setVariables,
  };
}
