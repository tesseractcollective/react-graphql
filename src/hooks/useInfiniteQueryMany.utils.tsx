import {print} from 'graphql';
import gql from 'graphql-tag';

import {
  QueryPostMiddlewareState,
  QueryPreMiddlewareState,
} from '../types/hookMiddleware';
import {HasuraDataConfig} from '../types/hasuraConfig';
import {getFieldFragmentInfo} from '../support/HasuraConfigUtils';

export function createInfiniteQueryMany(
  state: QueryPreMiddlewareState,
  config: HasuraDataConfig,
): QueryPostMiddlewareState {
  const name = config.typename;
  const operationName = config.overrides?.operationNames?.query_many ?? name;

  const {fragment, fragmentName} = getFieldFragmentInfo(
    config,
    config.overrides?.fieldFragments?.query_many,
  );

  const variables = state.variables;

  const variablesStrInner = [
    variables['where'] ? `$where: ${name}_bool_exp` : null,
    variables['orderBy'] ? `$orderBy: [${name}_order_by!]` : null,
    typeof('limit') === 'number' ? `$limit: Int` : null,
    typeof('offset') === 'number' ? `$offset: Int` : null,
    variables['userId'] ? `$userId: uuid` : null,
  ]
    .filter((x) => !!x)
    .join(', ');
  const variablesStr = variablesStrInner ? `(${variablesStrInner})` : '';

  const operationStr = [
    variables['where'] ? `where: $where` : null,
    variables['orderBy'] ? `order_by: $orderBy` : null,
    typeof('limit') === 'number' ? `limit: $limit` : null,
    typeof('offset') === 'number' ? `offset: $offset` : null,
  ]
    .filter((x) => !!x)
    .join(', ');

  const queryStr = `query ${name}Query${variablesStr} {
    ${name}(${operationStr}) {
      ...${fragmentName}
    }
  }
  ${print(fragment)}`;

  const document = gql(queryStr);

  return {document, operationName, variables: state.variables ?? {}};
}
