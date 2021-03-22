import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { UseQueryResponse, useQuery, UseQueryArgs } from 'urql';
import { usePagination } from './useInfiniteQueryMany.utils';

interface IUseInfiniteQueryMany {
  sharedConfig: HasuraDataConfig;
  middleware: QueryMiddleware[];
  initialVariables?: IJsonObject;
}

export default function useInfiniteQueryMany<TData extends IJsonObject, TVariables extends IJsonObject>(
  props: IUseInfiniteQueryMany,
) {
  const { sharedConfig, middleware, initialVariables } = props;

  const [meta, setMeta] = useState<{
    firstQueryCompleted: boolean;
    localError: string;
    detectedPks: Map<any, any>;
  }>({ firstQueryCompleted: false, localError: '', detectedPks: new Map() });
  const [itemsMap, setItemsMap] = useState<Map<any, TData>>(new Map());
  const [objectVariables, setObjectVariables] = useState<{ [key: string]: any }>(initialVariables ?? {});

  //Guards
  if (!sharedConfig || !middleware?.length) {
    throw new Error('sharedConfig and at least one middleware required');
  }

  //Setup the initial query Config so it's for sure ready before we get to urql
  const queryCfg: QueryPostMiddlewareState = useMemo(() => {
    const _tmp = middleware.reduce(
      (val, next: QueryMiddleware) => {
        const mState: QueryPostMiddlewareState = next(val, sharedConfig);
        let newState = {};
        if (val) Object.assign(newState, val);
        Object.assign(newState, mState);
        return newState as QueryPostMiddlewareState;
      },
      {
        variables: objectVariables,
      } as QueryPreMiddlewareState,
    );

    const _queryCfg = _tmp as QueryPostMiddlewareState;

    return _queryCfg;
  }, [sharedConfig, middleware, objectVariables]);

  const [resp, reExecuteQuery] = useQuery<T>({
    query: queryCfg?.query,
    variables: objectVariables,
  });

  useEffect(() => {
    reExecuteQuery();
  }, [queryCfg]);

  //Parse response
  useEffect(() => {
    if (resp.data) {
      const data: IJsonMapOfArraysObject = resp.data;
      const keys = Object.keys(data);
      if (keys.length === 1) {
        const key = keys[0];
        //only single response category so use single layer items
        const items: IJsonArray = data[key];
        if (!items?.length) return;

        const { detectedPks } = meta;
        let newDetectedPks;
        //detectPK
        if (!detectedPks.get(key)) {
          //Move to utility function and check for registered regex
          const itemKeys: any = items[0];
          const pks = itemKeys.filter((ik) => ['id', 'user_id'].indexOf(ik) >= 0);
          if (pks.length === 1) {
            newDetectedPks = new Map(detectedPks);
            newDetectedPks.set(key, pks[0]);
          }
        }

        const pk: string = detectedPks.get(key);
        let localError;
        if (!pk) {
          localError = 'Could not autodetect PK, please register pk patterns';
          setMeta({
            detectedPks: newDetectedPks ?? meta.detectedPks,
            firstQueryCompleted: true,
            localError,
          });
          return;
        }

        const newItems = new Map(itemsMap);
        items.forEach((itm: TData) => newItems.set(itm[pk], itm));
        setItemsMap(itemsMap);
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
  }, [resp.data]);

  //Update user items from map
  const results = useMemo(() => {
    if (itemsMap) {
      const arrayOfItems: any = Array.from(itemsMap.values());
      return arrayOfItems;
    }
    return [];
  }, [itemsMap]);

  return {
    results,
    localError: meta.localError,
    setObjectVariables,
    objectVariables,
  };
}

// document: DocumentNode,
// where?: {[key: string]: any},
// orderBy?: {[key: string]: any},
// primaryKey: string = defaultPrimaryKey,
// pageSize: number = defaultPageSize,
