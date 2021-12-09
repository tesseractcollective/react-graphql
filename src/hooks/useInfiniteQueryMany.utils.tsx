import { print } from 'graphql';
import gql from 'graphql-tag';

import { QueryPostMiddlewareState, QueryPreMiddlewareState } from '../types/hookMiddleware';
import { HasuraDataConfig } from '../types/hasuraConfig';
import { getFieldFragmentInfo } from '../support/HasuraConfigUtils';
import { buildDocument } from './support/buildDocument';
import { buildFragment } from './support/buildFragment';

export function createInfiniteQueryMany(
  state: QueryPreMiddlewareState,
  config: HasuraDataConfig,
): QueryPostMiddlewareState {
  const name = config.typename;
  const operationName = config.overrides?.operationNames?.query_many ?? name;

  const { fragment, fragmentName } = getFieldFragmentInfo(config, config.overrides?.fieldFragments?.query_many);

  const variables = state.variables;

  const variablesStrInner = [
    variables['where'] ? `$where: ${name}_bool_exp` : null,
    variables['orderBy'] ? `$orderBy: [${name}_order_by!]` : null,
    typeof variables['limit'] === 'number' ? `$limit: Int` : null,
    typeof variables['offset'] === 'number' ? `$offset: Int` : null,
    variables['userId'] ? `$userId: uuid` : null,
  ]
    .filter((x) => !!x)
    .join(', ');

  const variablesStr = variablesStrInner ? `(${variablesStrInner})` : '';

  const operationStrBase = [
    variables['where'] ? `where: $where` : null,
    variables['orderBy'] ? `order_by: $orderBy` : null,
    typeof variables['limit'] === 'number' ? `limit: $limit` : null,
    typeof variables['offset'] === 'number' ? `offset: $offset` : null,
    variables['distinctOn'] ? `distinct_on: ${variables['distinctOn']}` : null,
    variables['args'] ? `args: $args` : null,
  ]
    .filter((x) => !!x)
    .join(', ');

  const operationStr = operationStrBase ? `(${operationStrBase})` : '';

  const aggregateOperationStrBase = [
    variables['where'] ? `where: $where` : null,
    variables['distinctOn'] ? `distinct_on: ${variables['distinctOn']}` : null
  ]
    .filter((x) => !!x)
    .join(', ');

  const aggregateOperationStr = aggregateOperationStrBase ? `(${aggregateOperationStrBase})` : '';

  let frag = buildFragment(fragment, operationStr, variables);

  const aggregateQuery = config.excludeAggregate
    ? ``
    : `
  ${name}_aggregate${aggregateOperationStr} {
    aggregate {
      count
    }
  }`;

  const queryStr = `query ${name}Query${variablesStr} {
      ${name}${operationStr} {
        ...${fragmentName}
      }${aggregateQuery}
    }
    ${frag}`;

  const newVariables = { ...variables };
  if (newVariables.distinctOn) {
    delete newVariables.distinctOn;
  }

  const document = buildDocument(queryStr, operationStr, newVariables, 'useInifniteQueryMany', 'query');

  return { document, operationName, variables: newVariables ?? {} };
}
