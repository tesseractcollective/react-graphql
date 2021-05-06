import React from 'react';
import { bs } from '../support/styling/buildStyles';
import { HasuraDataConfig } from '../types/hasuraConfig';

export interface PaginationListProps<T> {
  config: HasuraDataConfig;
  // renderItem: ListRenderItem<T>;
  where?: { [key: string]: any };
  orderBy?: { [key: string]: any } | Array<{ [key: string]: any }>;
  primaryKey?: string;
  pageSize?: number;
}

export default function PaginatedList<T extends { [key: string]: any }>(props: PaginationListProps<T>) {
  // const { config, where, orderBy, pageSize, ...rest } = props;

  // const { loadNextPage, results } = useReactGraphql(config).useInfiniteQueryMany({
  //   initialVariables: {
  //     where,
  //     orderBy,
  //     pageSize,
  //   },
  // });

  //Error is Todo
  //Fetching is Todo

  return (
    <div style={bs(`w-99p b-1 b-blue-300 h-50`).single}>
      <div>PaginatedList</div>
    </div>
  );

  // return (
  //   <>
  //     {error ? (
  //       <Text>{error.message}</Text>
  //     ) : (
  //       <FlatList
  //         {...rest}
  //         refreshControl={<RefreshControl refreshing={fetching} onRefresh={refresh} />}
  //         data={results}
  //         renderItem={renderItem}
  //         keyExtractor={(item: any) => keyExtractor(config, item)}
  //         onEndReachedThreshold={1}
  //         onEndReached={loadNextPage}
  //       />
  //     )}
  //   </>
  // );
}
