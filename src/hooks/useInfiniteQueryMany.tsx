import { isEqual } from 'lodash';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { stateFromQueryMiddleware } from '../support/middlewareHelpers';
import { HasuraDataConfig } from '../types/hasuraConfig';
import { QueryMiddleware } from '../types/hookMiddleware';
import { findDefaultPks } from './support/findDefaultPks';
import { useUrqlQuery } from './useUrqlQuery';
import { useMonitorResult } from './support/monitorResult';
import { useAtom } from 'jotai';
import { mutationEventAtom, IMutationEvent } from './support/mutationEventAtom';
import { JsonArray, JsonObject } from 'type-fest';
import { OperationContext, RequestPolicy, UseQueryState } from 'urql';
import { IUseOperationStateHelperOptions, useOperationStateHelper } from './useOperationStateHelper';

export interface IUseInfiniteQueryMany {
  where?: { [key: string]: any };
  orderBy?: { [key: string]: any } | Array<{ [key: string]: any }>;
  distinctOn?: string;
  pageSize?: number;
  sharedConfig: HasuraDataConfig;
  middleware: QueryMiddleware[];
  listKey?: string;
  urqlContext?: Partial<OperationContext>;
  resultHelperOptions?: IUseOperationStateHelperOptions;
}

export interface IUseInfiniteQueryManyResults<TRecord> {
  queryState: UseQueryState<any, object>;
  items: TRecord[];
  localError: string;
  refresh: () => void;
  loadNextPage: () => void;
  requeryKeepInfinite: () => void;
  sharedConfig: HasuraDataConfig;
}

const defaultPageSize = 50;
const defaultUrqlContext: Partial<OperationContext> = { requestPolicy: 'cache-and-network' };

export function useInfiniteQueryMany<TData extends any>(
  props: IUseInfiniteQueryMany,
): IUseInfiniteQueryManyResults<TData> {
  const {
    sharedConfig,
    middleware,
    where,
    orderBy,
    distinctOn,
    pageSize,
    listKey,
    urqlContext = defaultUrqlContext,
  } = props;

  const limit = pageSize ?? defaultPageSize;

  const [meta, setMeta] = useState<{
    firstQueryCompleted: boolean;
    localError: string;
    queryError?: string;
    detectedPks: Map<string, string[]>;
  }>({ firstQueryCompleted: false, localError: '', detectedPks: new Map() });

  const [offset, setOffset] = useState(0);
  const [externalVariables, setExterneralVariables] = useState<any>({
    where,
    orderBy,
    limit,
    offset,
    distinctOn,
  });
  const [itemsMap, setItemsMap] = useState<Map<string, TData>>(new Map());
  const [shouldClearItems, setShouldClearItems] = useState(false);
  const [needsReQuery, setNeedsReQuery] = useState(false);

  //Guards
  if (!sharedConfig || !middleware?.length) {
    throw new Error('sharedConfig and at least one middleware required');
  }

  //Update internal variables from explicitly passed in
  useEffect(() => {
    const checkVariables = { where, orderBy, limit, distinctOn };
    if (!isEqual(externalVariables, checkVariables)) {
      setExterneralVariables(checkVariables);
      setOffset(0);
      setShouldClearItems(true);
    }
  }, [where, orderBy, limit, distinctOn]);

  //setup config
  const [queryCfg, setQueryCfg] = useState(computeConfig);

  useEffect(() => {
    const newState = computeConfig();
    setQueryCfg(newState);
  }, [externalVariables, offset]);

  // Setup the initial query Config so it's for sure ready before we get to urql
  const [queryState, reExecuteQuery] = useUrqlQuery<TData>(queryCfg, undefined, urqlContext);

  useEffect(() => {
    if (needsReQuery) {
      setNeedsReQuery(false);
      reExecuteQuery();
    }
  }, [needsReQuery]);

  useMonitorResult('query', queryState, queryCfg);

  //Parse response
  useEffect(() => {
    if (queryState.data) {
      const data: { [key: string]: JsonArray } = queryState.data;
      const keys = Object.keys(data);
      if (keys.length === 1) {
        const key = keys[0];
        //only single response category so use single layer items
        const queryItems: any[] = data[key] as any;
        const resultHasItems = !!queryItems?.length;

        const { detectedPks } = meta;
        let newDetectedPks;
        let pks = detectedPks.get(key);
        //detectPK
        if (!pks && resultHasItems) {
          if (sharedConfig.primaryKey) {
            newDetectedPks = new Map();
            newDetectedPks.set(key, sharedConfig.primaryKey);
          } else {
            //Move to utility function and check for registered regex
            newDetectedPks = findDefaultPks(queryItems, newDetectedPks, detectedPks, key);
          }
          pks = newDetectedPks?.get(key);
        }

        let localError;
        if (!pks && resultHasItems) {
          localError = 'Could not autodetect PK, please register pk patterns';
          setMeta({
            detectedPks: newDetectedPks ?? meta.detectedPks,
            firstQueryCompleted: true,
            localError,
          });
        }

        let newItemsMap = new Map(itemsMap);
        if (shouldClearItems) {
          newItemsMap = new Map();
          setShouldClearItems(false);
        }

        resultHasItems &&
          pks &&
          queryItems.forEach((item: any) => {
            const itemKey = pks!.map((pk) => item[pk]).join(':');
            newItemsMap.set(itemKey, item);
          });
        setItemsMap(newItemsMap);
        // console.log(
        //   '🚀 ~ file: useInfiniteQueryMany.tsx ~ line 138 ~ useEffect ~ newItemsMap',
        //   newItemsMap?.size + ' items found',
        //   newItemsMap?.size && newItemsMap.get(newItemsMap.keys().next().value),
        // );
        setMeta({
          detectedPks: newDetectedPks ?? meta.detectedPks,
          firstQueryCompleted: true,
          localError: '',
        });
      } else if (keys.length > 1) {
        // TODO: We queried more than one top level table so we have to nest inside the map accordingly
      } else {
        setMeta({
          detectedPks: meta.detectedPks,
          firstQueryCompleted: true,
          localError: 'OOPSIE POOPSIE',
        });
      }
    }
  }, [queryState.data]);

  //Effect/react on mutation events
  const [mutationEvent] = useAtom<IMutationEvent>(mutationEventAtom);

  useEffect(() => {
    
    const _listKey = listKey ?? sharedConfig.typename;
    const isMatchingListKey = _listKey === mutationEvent.listKey;

    if (!isMatchingListKey) {
      return;
    }

    if (mutationEvent?.type === 'insert-first') {
      const newMap = new Map();
      newMap.set(mutationEvent.key, mutationEvent.payload as TData);
      itemsMap.forEach((val, key) => newMap.set(key, val));
      setItemsMap(newMap);
    } else if (mutationEvent?.type === 'insert-last') {
      itemsMap.set(mutationEvent.key, mutationEvent.payload as TData);
      setItemsMap(itemsMap);
    } else if (mutationEvent?.type === 'update' && itemsMap.has(mutationEvent.key)) {
      itemsMap.set(mutationEvent.key, mutationEvent.payload as TData);
      setItemsMap(itemsMap);
    } else if (mutationEvent?.type === 'delete' && itemsMap.has(mutationEvent.key)) {
      itemsMap.delete(mutationEvent.key);
      setItemsMap(itemsMap);
    }
  }, [mutationEvent]);

  //Update user items from map
  const items: TData[] = useMemo(() => {
    return Array.from(itemsMap.values());
  }, [itemsMap]);

  const loadNextPage = () => {
    if (!queryState.fetching) {
      if (items?.length && items?.length % limit === 0) {
        setOffset(offset + limit);
      }
    }
  };

  const refresh = useCallback(() => {
    setOffset(0);
    setShouldClearItems(true);
    setNeedsReQuery(true);
  }, []);

  const requeryKeepInfinite = () => {
    setNeedsReQuery(true);
  };

  useOperationStateHelper(queryState, props.resultHelperOptions || {});

  return {
    queryState,
    items,
    localError: meta.localError,
    refresh,
    loadNextPage,
    requeryKeepInfinite,
    sharedConfig
  };

  function computeConfig() {
    const variables = { ...externalVariables, offset };
    return stateFromQueryMiddleware({ variables }, middleware, sharedConfig);
  }
}
