import React, { ReactElement, useState } from 'react';
import { FlatList, ListRenderItem, RefreshControl, ScrollViewProps, Text } from 'react-native';
// import {useIsFocused} from '@react-navigation/core';
import { useReactGraphql } from '../../hooks/useReactGraphql';
import { keyExtractor } from '../../support/HasuraConfigUtils';
import { HasuraDataConfig } from '../../types/hasuraConfig';
import { QueryMiddleware } from '../../types/hookMiddleware';

const defaultPageSize = 50;

export interface PaginationListProps<T> {
  config: HasuraDataConfig;
  renderItem: ListRenderItem<T>;
  where?: { [key: string]: any };
  orderBy?: { [key: string]: any } | Array<{ [key: string]: any }>;
  pageSize?: number;
  primaryKey?: string;
  reloadOnFocus?: boolean;
  pullToRefresh?: boolean;
  middleware?: QueryMiddleware[];
  renderEmpty?: () => ReactElement;
  listKey?: string;
}

export function PaginatedList<T extends { [key: string]: any }>(props: PaginationListProps<T> & ScrollViewProps) {
  const {
    config,
    renderItem,
    where,
    orderBy,
    pageSize,
    reloadOnFocus,
    pullToRefresh = true,
    middleware,
    listKey,
    ...rest
  } = props;

  const { loadNextPage, items, queryState, refresh } = useReactGraphql(config).useInfiniteQueryMany<T>({
    where,
    orderBy,
    pageSize,
    middleware: middleware || undefined,
    listKey,
  });
  const { fetching, error } = queryState;

  // const isFocused = useIsFocused();
  const [isManualRefresh, setIsManualRefresh] = useState(false);
  const [hasLostFocus, setHasLostFocus] = useState(false);

  // useEffect(() => {
  //   if (reloadOnFocus) {
  //     setHasLostFocus(!isFocused);
  //     if (isFocused && hasLostFocus) {
  //       setIsManualRefresh(false);
  //       console.log('refresh');
  //       refresh();
  //     }
  //   }
  // }, [isFocused, hasLostFocus, reloadOnFocus]);

  const handleRefresh = () => {
    setIsManualRefresh(true);
    refresh();
  };

  return (
    <>
      {error ? (
        <Text>{error.message}</Text>
      ) : (
        <FlatList
          {...rest}
          refreshControl={
            pullToRefresh ? (
              <RefreshControl refreshing={fetching && !isManualRefresh} onRefresh={handleRefresh} />
            ) : undefined
          }
          data={items as any[]}
          renderItem={renderItem}
          keyExtractor={(item: T) => keyExtractor(config, item)}
          onEndReachedThreshold={1}
          onEndReached={loadNextPage}
        />
      )}
    </>
  );
}
