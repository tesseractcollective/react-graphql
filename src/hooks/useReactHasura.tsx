import React, { useState, useEffect } from 'react';

import { getFieldFragmentInfo } from '../support/HasuraConfigUtils';
import { print } from 'graphql';
import useMutate from './useMutate';
import { createDeleteMutation, createInsertMutation, createUpdateMutation } from './useMutate.utils';
import useInfiniteQueryMany from './useInfiniteQueryMany';
import { createInfiniteQueryMany, usePagination } from './useInfiniteQueryMany.utils';

export default function useReactHasura(config: HasuraDataConfig) {
  return {
    useInsert: (props: { initialVariables?: IJsonObject; middleware: MutationMiddleware[] }) =>
      useMutate({
        sharedConfig: config,
        middleware: props.middleware ?? [createInsertMutation],
        initialVariables: props.initialVariables,
      }),
    useDelete: (props: { initialVariables?: IJsonObject; middleware: MutationMiddleware[] }) =>
      useMutate({
        sharedConfig: config,
        middleware: props.middleware ?? [createDeleteMutation],
        initialVariables: props.initialVariables,
      }),
    useUpdate: (props: { initialVariables?: IJsonObject; middleware: MutationMiddleware[] }) =>
      useMutate({
        sharedConfig: config,
        middleware: props.middleware ?? [createUpdateMutation],
        initialVariables: props.initialVariables,
      }),
    useInfiniteQueryMany: (props: { initialVariables?: IJsonObject; middleware?: QueryMiddleware[] }) => {
      const { refresh, loadNextPage, middleware: paginationMiddleware } = usePagination(
        props?.initialVariables?.pageSize,
      );

      const [middlewares, setMiddlewares] = useState(
        props.middleware ?? [paginationMiddleware, createInfiniteQueryMany],
      );

      const q = useInfiniteQueryMany({
        sharedConfig: config,
        middleware: middlewares,
        initialVariables: props.initialVariables,
      });

      useEffect(() => {
        if (!props.middleware && paginationMiddleware) {
          setMiddlewares([paginationMiddleware, createInfiniteQueryMany]);
        }
      }, [props.middleware, paginationMiddleware]);

      return {
        ...q,
        refresh,
        loadNextPage,
      };
    },
  };
}
