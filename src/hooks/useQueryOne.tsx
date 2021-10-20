import { useState, useEffect } from "react";
import { HasuraDataConfig } from "../types/hasuraConfig";
import { QueryMiddleware } from "../types/hookMiddleware";
import {
  OperationContext,
  useQuery,
  UseQueryResponse,
  UseQueryState,
} from "urql";
import { stateFromQueryMiddleware } from "../support/middlewareHelpers";
import { keyExtractor } from "../support/HasuraConfigUtils";
import { useAtom } from "jotai";
import { IMutationEvent, mutationEventAtom } from "./support/mutationEventAtom";
import { JsonObject } from "type-fest";
import _ from "lodash";
import {
  IUseOperationStateHelperOptions,
  useOperationStateHelper,
} from "./useOperationStateHelper";
import { log } from "../support/log";

interface IUseQueryOne<TVariables> {
  sharedConfig: HasuraDataConfig;
  middleware: QueryMiddleware[];
  variables: Partial<TVariables>;
  resultHelperOptions?: IUseOperationStateHelperOptions;
  urqlContext?: Partial<OperationContext>;
}

export interface QueryState {
  item?: any;
  localError: undefined;
  fetching: boolean;
  error?: Error;
  queryState?: UseQueryState;
  stale: boolean;
  refresh: () => void;
  setVariables: React.Dispatch<React.SetStateAction<JsonObject>>;
  variables: JsonObject;
}

const defaultUrqlContext: Partial<OperationContext> = {
  requestPolicy: "cache-and-network",
};

export function useQueryOne<
  TData extends JsonObject,
  TVariables extends JsonObject
>(props: IUseQueryOne<TVariables>): QueryState {
  const {
    sharedConfig,
    middleware,
    variables,
    urqlContext = defaultUrqlContext,
  } = props;

  const [item, setItem] = useState<TData | null>();
  const [queryStateStored, setQueryStateStored] = useState<UseQueryState>({
    fetching: true,
    stale: false,
  });
  const [key, setKey] = useState<string>();
  const [objectVariables, setObjectVariables] = useState<JsonObject>(variables);

  const [mutationEvent] = useAtom<IMutationEvent>(mutationEventAtom);

  //Guards
  if (!sharedConfig || !middleware?.length) {
    throw new Error(`Hasura config and at least one middleware required.
    You are missing: ${!sharedConfig ? "HasuraConfig" : ""} ${
      !!middleware?.length ? " Middleware" : ""
    }`);
  }

  const [queryCfg, setQueryCfg] = useState(computeConfig);
  const [queryState, reExecuteQuery] = useQuery<TData>({
    query: queryCfg?.document,
    variables: queryCfg.variables,
    context: urqlContext,
  });
  log.debug("🚀 ~ file: useQueryOne.tsx ~ line 39 ~ resp", queryState);

  useEffect(() => {
    updateItemKey();
  }, [item, objectVariables]);

  useEffect(() => {
    if (mutationEvent.type === "init") {
      return;
    }

    logMutationEvent();

    if (
      mutationEvent.listKey === sharedConfig.typename &&
      (mutationEvent.key === key || !key)
    ) {
      if (mutationEvent.type === "delete") {
        setItem(null);
      } else {
        setItem(mutationEvent.payload as TData);
      }
    } else if (
      mutationEvent.listKey &&
      sharedConfig.typename &&
      mutationEvent.listKey !== sharedConfig.typename
    ) {
      logMismatchedMutationEvent();
    }
  }, [mutationEvent]);

  useEffect(() => {
    reExecuteQuery();
  }, [queryCfg]);

  useEffect(() => {
    const newState = computeConfig();
    if (!_.isEqual(newState, queryCfg)) {
      log.debug(
        "useQueryOne -> useEffect -> computeConfig -> newState",
        newState
      );
      setQueryCfg(newState);
    }
  }, [objectVariables]);

  //Parse response
  useEffect(() => {
    if (queryState.data) {
      log.debug("⛱️ resp.data", queryState.data);
      setItem(queryState.data[queryCfg.operationName] as any);
    }
    setQueryStateStored(queryState);
  }, [queryState]);

  useOperationStateHelper(queryState, props.resultHelperOptions || {});

  return {
    item,
    localError: undefined,
    fetching: queryStateStored.fetching,
    error: queryStateStored.error,
    stale: queryStateStored.stale,
    refresh: reExecuteQuery,
    setVariables: setObjectVariables,
    variables: objectVariables,
  };

  function logMismatchedMutationEvent() {
    log.info(
      `❗ <- mismatched model types <- mutationEvent recieved <- useQueryOne
               ${mutationEvent.listKey} !== ${sharedConfig.typename}
               Recieved a mutationEvent with a key of ${mutationEvent.listKey}
               This instance of the useQueryOne hook was given a config for ${sharedConfig.typename}
        `
    );
  }

  function logMutationEvent() {
    log.info(
      "mutationEvent recieved <- Before check <- useQueryOne",
      JSON.stringify(
        {
          c1: mutationEvent.listKey == sharedConfig.typename,
          "me:listKey": mutationEvent.listKey,
          typename: sharedConfig.typename,
          c2: mutationEvent.key === key || !key,
          "me:key": mutationEvent.key,
          key: key ?? "NO KEY",
          mutationEvent,
        },
        null,
        2
      )
    );
  }

  function updateItemKey() {
    if (!sharedConfig || (!item && !objectVariables)) {
      return;
    }
    let newKey = item
      ? keyExtractor(sharedConfig, item)
      : keyExtractor(sharedConfig, objectVariables);
    if (newKey) {
      if (newKey !== key) {
        setKey(newKey);
      }
    } else if (item?.typename !== sharedConfig.typename) {
      log.error(
        `❗ useQueryOne -> item -> keyExtractor failed',
                  //  ${item?.typename} !== ${sharedConfig.typename}
                   Recieved a item with a key of ${item?.listKey}
                   This instance of the useQueryOne hook was given a config for ${sharedConfig.typename}
            `
      );
    } else {
      log.error(
        `❗ useQueryOne -> item -> keyExtractor failed for unknown reasons'`,
        JSON.stringify(
          {
            item,
            "sharedConfig.typename": sharedConfig.typename,
          },
          null,
          2
        )
      );
    }
  }

  function computeConfig() {
    return stateFromQueryMiddleware(
      { variables: objectVariables },
      middleware,
      sharedConfig
    );
  }
}
