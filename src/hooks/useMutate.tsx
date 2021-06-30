import { useEffect, useState, useCallback } from "react";
import { HasuraDataConfig } from "../types/hasuraConfig";
import {
  QueryMiddleware,
  QueryPostMiddlewareState,
} from "../types/hookMiddleware";
import {
  OperationContext,
  useMutation,
  UseMutationState,
} from "urql";
import { stateFromQueryMiddleware } from "../support/middlewareHelpers";
import { useMonitorResult } from "./support/monitorResult";
import { mutationEventAtom } from "./support/mutationEventAtom";
import { useAtom } from "jotai";
import { keyExtractor } from "../support/HasuraConfigUtils";
import { print } from "graphql";
import { JsonObject } from "type-fest";
import { IUseOperationStateHelperOptions, useOperationStateHelper } from "./useOperationStateHelper";


interface IUseMutateProps {
  sharedConfig: HasuraDataConfig;
  middleware: QueryMiddleware[];
  initialItem?: JsonObject;
  initialVariables?: JsonObject;
  operationEventType: "insert-first" | "insert-last" | "update" | "delete";
  listKey?: string;
  resultHelperOptions?: IUseOperationStateHelperOptions
}

export interface MutateState {
  resultItem?: any;
  mutating: boolean;
  error?: Error;
  mutationState: UseMutationState;
  mutationConfig: QueryPostMiddlewareState;
  executeMutation: (
    itemValues?: JsonObject,
    variables?: JsonObject,
    context?: Partial<OperationContext>
  ) => void;
  setItemValue: (key: string, value: any) => void;
  item?: JsonObject;
  setVariable: (name: string, value: any) => void;
  variables: JsonObject;  
}

export function useMutate<T extends JsonObject>(
  props: IUseMutateProps
): MutateState {
  const { sharedConfig, middleware, initialVariables, initialItem, listKey } =
    props;
  //MutationConfig is what we internally refer to the middlewareState as

  const [variables, setVariables] = useState<JsonObject>(initialVariables || {});
  const [item, setItem] = useState<JsonObject | undefined>(initialItem);
  const [needsExecuteMutation, setNeedsExecuteMutation] = useState<boolean>();
  const [executeContext, setExecuteContext] =
    useState<Partial<OperationContext> | null>();
  const [_, setMutationEvent] = useAtom(mutationEventAtom);

  //Guards
  if (!sharedConfig || !middleware?.length) {
    throw new Error("sharedConfig and at least one middleware required");
  }
  const computeConfig = (variables: JsonObject, item?: JsonObject) => {
    const variablesWithItem = {
      ...variables,
      item,
    };

    return stateFromQueryMiddleware(
      { variables: variablesWithItem },
      middleware,
      sharedConfig
    );
  };

  const [mutationCfg, setMutationCfg] = useState(
    computeConfig(variables, item)
  );
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
        setNeedsExecuteMutation(false);

        console.log("💪 executingMutation");
        console.log(print(mutationCfg.document));
        console.log(JSON.stringify({ variables: mutationCfg.variables }));

        const resp = await executeMutation(mutationCfg.variables);
        const successItem = resp?.data?.[mutationCfg.operationName];

        if (successItem) {
          const key = keyExtractor(sharedConfig, successItem);
          console.log("setMutationEvent");

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

  useMonitorResult("mutation", mutationResult, mutationCfg);

  //Handling variables
  const setVariable = useCallback((name: string, value: any) => {
    setVariables((original) => ({
      ...original,
      [name]: value,
    }));
  }, []);

  const setItemValue = useCallback((key: string, value: any) => {
    setItem((original) => ({
      ...original,
      [key]: value,
    }));
  }, []);

  const wrappedExecuteMutation = (
    _itemValues?: JsonObject,
    _variables?: JsonObject,
    context?: Partial<OperationContext>
  ) => {
    if (_variables || _itemValues) {
      const newVariables = {
        ...variables,
        ..._variables,
      };
      const newItem = {
        ...item,
        ..._itemValues,
      };

      // you need to do both because setVariables triggers the
      // useEffect to compute the new config on the next render
      // cycle
      setMutationCfg(computeConfig(newVariables, newItem));
      setVariables(newVariables);
      setItem(newItem);
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
    variables,
    setVariable,
  };
}
