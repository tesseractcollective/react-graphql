import { useEffect, useState, useCallback } from 'react';
import { HasuraDataConfig } from '../types/hasuraConfig';
import { QueryMiddleware, QueryPostMiddlewareState } from '../types/hookMiddleware';
import { OperationContext, useMutation, UseMutationState, UseQueryState } from 'urql';
import { JsonObject } from 'type-fest';
import { useMutate } from './useMutate';
import { useQueryOne } from './useQueryOne';
import { createQueryOne } from './useQueryOne.utils';
import { createUpdateMutation, createPkArgsString } from './useMutate.utils';
import { useOperationStateHelper, IUseOperationStateHelperOptions } from './useOperationStateHelper';

export interface IUseMutateExisting {
  sharedConfig: HasuraDataConfig;
  queryMiddleware: QueryMiddleware[];
  queryVariables: JsonObject;
  mutationMiddleware: QueryMiddleware[];
  mutationResultHelperOptions?: IUseOperationStateHelperOptions
  // operationEventType: "insert-first" | "insert-last" | "update" | "delete";
}

export interface UseMutationExistingState {
  queryItem?: any;
  queryError?: Error;
  queryState?: UseQueryState;
  refresh: () => void;
  setQueryVariables: React.Dispatch<React.SetStateAction<JsonObject>>;
  queryVariables: JsonObject;

  mutationResultItem?: any;
  mutating: boolean;
  mutationError?: Error;
  mutationState: UseMutationState;
  mutationConfig: QueryPostMiddlewareState;
  executeMutation: (itemValues?: JsonObject, variables?: JsonObject, context?: Partial<OperationContext>) => void;
  setMutationItemValue: (key: string, value: any) => void;
  mutationItem?: JsonObject;
  setMutationVariable: (name: string, value: any) => void;
  mutationVariables: JsonObject;
}

export function useMutateExisting<T extends JsonObject>(props: IUseMutateExisting): UseMutationExistingState {
  const { sharedConfig } = props;

  const {
    refresh,
    setVariables: setQueryVariables,
    variables: queryVariables,
    error: queryError,
    item: queryItem,
    queryState,
  } = useQueryOne({
    sharedConfig,
    middleware: props?.queryMiddleware || [createQueryOne],
    variables: props.queryVariables,
  });

  const {
    executeMutation,
    mutating,
    mutationConfig,
    mutationState,
    setItemValue: setMutationItemValue,
    setVariable: setMutationVariable,
    variables: mutationVariables,
    error: mutationError,
    item: mutationItem,
    resultItem: mutationResultItem,
  } = useMutate({
    sharedConfig,
    middleware: props?.mutationMiddleware || [createUpdateMutation],
    operationEventType: 'update',
    initialVariables: queryVariables
  });

  useEffect(() => {
    if (queryItem) {
      Object.keys(queryItem).filter(x=> !x.startsWith('__') && sharedConfig.primaryKey.indexOf(x) === -1).forEach((key) => queryItem[key] && setMutationItemValue(key, queryItem[key]));
    }
  }, [queryItem]);

  useOperationStateHelper(mutationState, props.mutationResultHelperOptions || {});

  return {
    queryItem,
    queryError,
    queryState,
    refresh,
    setQueryVariables,
    queryVariables,

    mutationResultItem,
    mutating,
    mutationError,
    mutationState,
    mutationConfig,
    executeMutation,
    setMutationItemValue,
    mutationItem,
    setMutationVariable,
    mutationVariables,
  };
}
