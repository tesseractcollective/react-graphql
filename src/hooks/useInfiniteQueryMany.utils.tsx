import { getFieldFragmentInfo } from '../support/HasuraConfigUtils';
import { print } from 'graphql';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { map } from 'lodash';

const defaultPageSize = 50;

export function usePagination(pageSize: number = defaultPageSize) {
  const limit = pageSize;
  const [offset, setOffset] = useState(0);

  const loadNextPage = () => {
    setOffset(offset + limit);
  };

  const refresh = () => {
    setOffset(0);
  };

  const middleware = (state: QueryPreMiddlewareState, config: HasuraDataConfig): QueryPostMiddlewareState => {
    let newState = { ...state };
    if (offset) {
      newState.variables.offset = offset;
    }
    newState.variables.limit = limit;

    return newState;
  };

  return { refresh, loadNextPage, middleware };
}

const querySupportedVariables = { where: true, orderBy: true, limit: true, offset: true };

export function createInfiniteQueryMany(
  state: QueryPreMiddlewareState,
  config: HasuraDataConfig,
): QueryPostMiddlewareState {
  const name = config.typename;
  const operationName = config.overrides?.operationNames?.query_many ?? `delete_${name}_by_pk`;

  const { fragment, fragmentName } = getFieldFragmentInfo(config, config.overrides?.fieldFragments?.delete_by_pk);

  const variables = state.variables;

  const variablesStr = [
    variables['where'] ? `$where: ${name}_bool_exp` : null,
    variables['orderBy'] ? `$orderBy: ${name}_order_by!` : null,
  ]
    .filter((x) => !!x)
    .join(', ');

  const operationStr = [
    variables['where'] ? `where: $where` : null,
    variables['orderBy'] ? `order_by: $orderBy` : null,
    variables['limit'] ? `limit: ${variables.limit}` : null,
    variables['offset'] ? `offset: ${variables.offset}` : null,
  ]
    .filter((x) => !!x)
    .join(', ');
    

  const query = gql`query ${name}Query(${variablesStr}) {
      ${name}(${operationStr}) {
        ...${fragmentName}
      }
    }
    ${print(fragment)}`;

  const pkColumns: { [key: string]: any } = {};
  for (const key of config.primaryKey) {
    pkColumns[key] = state.variables?.[key];
  }

  return { query, operationName, variables: state.variables ?? {}, pkColumns };
}
