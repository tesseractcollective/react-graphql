import useReactHasura from 'hooks/useReactHasura';
import { HasuraDataConfig } from 'types/hasuraConfig';

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

  return <div>PaginatedList</div>;

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
