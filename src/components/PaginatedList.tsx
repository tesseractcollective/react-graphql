import React from 'react';
import useReactHasura from 'hooks/useReactHasura';
import { HasuraDataConfig } from 'types/hasuraConfig';
import { Divider,Text } from 'react-native-elements';
import { bs } from '../support/styling/buildStyles';

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

  // const { loadNextPage, results } = useReactHasura(config).useInfiniteQueryMany({
  //   initialVariables: {
  //     where,
  //     orderBy,
  //     pageSize,
  //   },
  // });

  //Error is Todo
  //Fetching is Todo

  return (
    <Divider style={bs(`w-99p b-1 b-blue-300 h-50`)}>
      <Text>PaginatedList</Text>
    </Divider>
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
