import { useEffect, useState, useCallback } from 'react';
import { HasuraDataConfig } from '../types/hasuraConfig';
import { OperationTypes, QueryMiddleware, QueryPostMiddlewareState } from '../types/hookMiddleware';
import { OperationContext, useMutation, UseMutationState } from 'urql';
import { stateFromQueryMiddleware } from '../support/middlewareHelpers';
import { useMonitorResult } from './support/monitorResult';
import { mutationEventAtom } from './support/mutationEventAtom';
import { useAtom } from 'jotai';
import { keyExtractor } from '../support/HasuraConfigUtils';
import { print } from 'graphql';
import { JsonObject } from 'type-fest';
import { IUseOperationStateHelperOptions, useOperationStateHelper } from './useOperationStateHelper';
import { findMissingPrimaryKeys } from './useMutate.utils';

export interface IUseMutateProps<TVariables, TItem> {
  sharedConfig: HasuraDataConfig;
  middleware: QueryMiddleware[];
  initialItem?: Partial<TItem>;
  initialVariables?: Partial<TVariables>;
  operationEventType: OperationTypes;
  listKey?: string;
  resultHelperOptions?: IUseOperationStateHelperOptions;
}

export interface MutateState<TResultData = any, TVariables = any, TItem = any> {
  resultItem?: TResultData;
  mutating: boolean;
  error?: Error;
  mutationState: UseMutationState;
  mutationConfig: QueryPostMiddlewareState;
  executeMutation: (
    itemValues?: Partial<TItem>,
    variables?: Partial<TVariables>,
    context?: Partial<OperationContext>,
  ) => void;
  setItemValue: (key: string, value: any) => void;
  setItem: (newValue: Partial<TItem>) => void;
  item: Partial<TItem>;
  setVariable: (name: string, value: any) => void;
  variables: Partial<TVariables>;
}

export function useMutate<TResultData extends JsonObject, TVariables extends JsonObject, TItem extends JsonObject>(
  props: IUseMutateProps<TVariables, TItem>,
): MutateState<TResultData, TVariables, TItem> {
  const { sharedConfig, middleware, initialVariables, initialItem, listKey } = props;
  //MutationConfig is what we internally refer to the middlewareState as

  const [variables, setVariables] = useState<Partial<TVariables>>(initialVariables || {});
  const [item, setItem] = useState<Partial<TItem>>(initialItem || {});
  const [needsExecuteMutation, setNeedsExecuteMutation] = useState<boolean>();
  const [executeContext, setExecuteContext] = useState<Partial<OperationContext> | null>();
  const [_, setMutationEvent] = useAtom(mutationEventAtom);

  //Guards
  if (!sharedConfig || !middleware?.length) {
    throw new Error('sharedConfig and at least one middleware required');
  }
  const computeConfig = (variables: Partial<TVariables>, item?: Partial<TItem>) => {
    const variablesWithItem = {
      ...variables,
      item,
    };

    return stateFromQueryMiddleware({ variables: variablesWithItem }, middleware, sharedConfig);
  };

  const [mutationCfg, setMutationCfg] = useState(computeConfig(variables, item));
  useEffect(() => {
    const newState = computeConfig(variables, item);
    setMutationCfg(newState);
  }, [variables, item]);

  //The mutation
  const [mutationResult, executeMutation] = useMutation(mutationCfg.document);
  const resultItem = mutationResult.data?.[mutationCfg.operationName];

  useEffect(() => {
    (async () => {
      if (needsExecuteMutation && !executeContext) {
        const missingPks = findMissingPrimaryKeys(sharedConfig, mutationCfg, false);
        const isInsert = props.operationEventType === 'insert-first' || props.operationEventType === 'insert-last';
        if (!isInsert && missingPks) {
          throw new Error(`When using useDelete or useUpdate you need to ensure you pass in variables that match the primary keys needed for this type.
            The operation for this was: ${mutationCfg.operationName}.
            We detected the following primary keys from config.primaryKey: ${sharedConfig.primaryKey}
            The following were not found in the variables but were needed: ${missingPks.join(', ')}
            This was for the config: ${sharedConfig.typename}
            The current middleware state was: ${JSON.stringify(mutationCfg, null, 2)}
            `);
        }

        setNeedsExecuteMutation(false);

        console.log('💪 executingMutation');
        console.log(print(mutationCfg.document));
        console.log(JSON.stringify({ variables: mutationCfg.variables }));

        const resp = await executeMutation(mutationCfg.variables);
        const successItem = resp?.data?.[mutationCfg.operationName];

        if (successItem) {
          const key = keyExtractor(sharedConfig, successItem);
          console.log('setMutationEvent');

          setMutationEvent(() => ({
            listKey: listKey ?? sharedConfig.typename,
            type: props.operationEventType,
            key: key,
            payload: {
              ...successItem,
            },
          }));
        }
      }
    })();
  }, [needsExecuteMutation, executeContext, executeMutation, mutationCfg]);

  useMonitorResult('mutation', mutationResult, mutationCfg);

  //Handling variables
  const setVariable = useCallback((name: string, value: any) => {
    setVariables((original) => ({
      ...original,
      [name]: value,
    }));
  }, []);

  const setItemValue = useCallback((key: any, value: any) => {
    setItem((original) => ({
      ...original,
      [key]: value,
    }));
  }, []);

  const wrappedExecuteMutation = (
    _itemValues?: Partial<TItem>,
    _variables?: Partial<TVariables>,
    context?: Partial<OperationContext>,
  ) => {
    let newVariables;
    let newItem;
    if (_variables) {
      newVariables = {
        ...variables,
        ..._variables,
      };
      setVariables(newVariables);
    }
    if (_itemValues) {
      newItem = {
        ...item,
        ..._itemValues,
      };
      setItem(newItem);
    }

    if (newVariables || newItem) {
      // you need to do both because setVariables triggers the
      // useEffect to compute the new config on the next render
      // cycle
      setMutationCfg(computeConfig(newVariables || {}, newItem || {}));
    }
    if (context) {
      setExecuteContext(context);
    } else {
      setNeedsExecuteMutation(true);
    }
  };

  useOperationStateHelper(mutationResult, props.resultHelperOptions || {});

  //Return values
  return {
    resultItem,
    mutating: mutationResult.fetching,
    error: mutationResult.error,
    mutationState: mutationResult,
    mutationConfig: mutationCfg,
    executeMutation: wrappedExecuteMutation,
    item,
    setItemValue,
    setItem,
    variables,
    setVariable,
  };
}
