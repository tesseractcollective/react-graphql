import React from 'react';
import {getFieldFragmentInfo} from '../support/HasuraConfigUtils';
import {print} from 'graphql';
import gql from 'graphql-tag';
import {
  QueryMiddleware,
  QueryPostMiddlewareState,
  QueryPreMiddlewareState,
} from '../types/hookMiddleware';
import {HasuraDataConfig} from '../types/hasuraConfig';
import { JsonObject } from 'type-fest';
import { buildFragment } from './support/buildFragment';
import { buildDocument } from './support/buildDocument';

interface IUseQueryOne {
  sharedConfig: HasuraDataConfig;
  middleware: QueryMiddleware[];
  initialVariables?: JsonObject;
}

export function createQueryOne<
  TData extends JsonObject,
  TVariables extends JsonObject
>(
  state: QueryPreMiddlewareState,
  config: HasuraDataConfig,
): QueryPostMiddlewareState {
  const name = config.typename;
  const operationName =
    config.overrides?.operationNames?.query_by_pk ?? `${name}_by_pk`;

  const {fragment, fragmentName} = getFieldFragmentInfo(
    config,
    config.overrides?.fieldFragments?.query_by_pk,
  );

  const variables = state.variables;

  const operationStr = config.primaryKey
    .map((key) => {
      return variables[key] ? `${key}: "${variables[key]}"` : null;
    })
    .filter((x) => !!x)
    .join(', ');

  let frag = buildFragment(fragment, operationStr, variables);

  const queryString = `query ${name}Query {
    ${operationName}(${operationStr}) {
      ...${fragmentName}
    }
  }
  ${frag}`;

  const document = buildDocument(queryString, operationStr, variables, 'useInifniteQueryMany', 'query');

  return { document, operationName, variables: {} ?? {} };
}
