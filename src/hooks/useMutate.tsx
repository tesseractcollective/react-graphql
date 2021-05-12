import { useEffect, useState, useCallback } from "react";
import { HasuraDataConfig } from "../types/hasuraConfig";
import { QueryMiddleware } from "../types/hookMiddleware";
import { OperationContext, stringifyVariables, useMutation, UseMutationState } from "urql";
import { stateFromQueryMiddleware } from "../support/middlewareHelpers";
import { useMonitorResult } from "./support/monitorResult";
import { mutationEventAtom } from "./support/mutationEventAtom";
import { useAtom } from "jotai";
import { keyExtractor } from "../support/HasuraConfigUtils";
import { print } from "graphql";
import { JsonObject } from "type-fest";
import { Variable, VariableMap } from "types";

interface IUseMutateProps {
  sharedConfig: HasuraDataConfig;
  middleware: QueryMiddleware[];
  initialItem?: JsonObject;
  initialVariables?: Variable[];
  operationEventType: "insert-first" | "insert-last" | "update" | "delete";
  listKey?: string;
}

export interface MutateState {
  resultItem?: any;
  mutating: boolean;
  error?: Error;
  mutationState: UseMutationState;
  executeMutation: (
    itemValues?: JsonObject,
    variables?: Variable[],
    context?: Partial<OperationContext>
  ) => void;
  setItemValue: (key: string, value: any) => void;
  item: JsonObject;
  setVariable: (name: string, value: any, type: string) => void;
  variables: VariableMap;
}

export function useMutate<T extends JsonObject>(
  props: IUseMutateProps
): MutateState {
  const { sharedConfig, middleware, initialVariables, initialItem, listKey } =
    props;
  //MutationConfig is what we internally refer to the middlewareState as

  const [variables, setVariables] = useState<VariableMap>(
    (initialVariables || []).reduce<VariableMap>((previous, variable) => {
      previous[variable.name] = variable;
      return previous;
    }, {})
  );
  const [item, setItem] = useState<JsonObject>(initialItem || {});
  const [needsExecuteMutation, setNeedsExecuteMutation] = useState<boolean>();
  const [executeContext, setExecuteContext] =
    useState<Partial<OperationContext> | null>();

  const [_, setMutationEvent] = useAtom(mutationEventAtom);

  //Guards
  if (!sharedConfig || !middleware?.length) {
    throw new Error("sharedConfig and at least one middleware required");
  }
  const computeConfig = (variables: VariableMap, item: JsonObject) => {
    const variablesWithItem = {
      ...variables,
      item: {
        name: "item",
        value: item,
        type: "",
      },
    };

    const state = stateFromQueryMiddleware(
      { variables: variablesWithItem },
      middleware,
      sharedConfig
    );
    return state;
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

        const variables = Object.keys(mutationCfg.variables).reduce<JsonObject>(
          (previous, key) => {
            previous[key] = mutationCfg.variables[key].value;
            return previous;
          },
          {}
        );

        console.log("💪 executingMutation");
        console.log(print(mutationCfg.document));
        console.log(JSON.stringify({ variables }));

        const resp = await executeMutation(variables);
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
  const setVariable = useCallback((name: string, value: any, type: string) => {
    setVariables((original) => ({
      ...original,
      [name]: { name, value, type },
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
    _variables?: Variable[],
    context?: Partial<OperationContext>
  ) => {
    if (_variables || _itemValues) {
      const variableMap = (_variables || []).reduce<VariableMap>((previous, variable) => {
        previous[variable.name] = variable;
        return previous;
      }, {});
      const newVariables = {
        ...variables,
        ...variableMap,
      };
      const newItem = {
        ...item,
        ..._itemValues,
      };

      // you need to both because setVariables triggers the
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

  //Return values
  return {
    resultItem,
    mutating: mutationResult.fetching,
    error: mutationResult.error,
    mutationState: mutationResult,
    executeMutation: wrappedExecuteMutation,
    item,
    setItemValue,
    variables,
    setVariable,
  };
}
