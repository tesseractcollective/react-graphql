import { keyExtractor } from '../../support/HasuraConfigUtils';
import { IUseInfiniteQueryManyResults } from '../useInfiniteQueryMany';


export interface PaginationListProps {
  queryState: IUseInfiniteQueryManyResults<any>;
  onEndReachedThreshold?: number;
}

export function usePaginatedList(args: PaginationListProps) {
  return {
    data: args.queryState.items,
    keyExtractor: (item: any) => keyExtractor(args.queryState.sharedConfig, item),
    onEndReachedThreshold: args.onEndReachedThreshold || 0.9,
    onEndReached: args.queryState.loadNextPage,
  };
}
