import React from 'react';
import { getFieldFragmentInfo } from '../support/HasuraConfigUtils';
import { print } from 'graphql';
import gql from 'graphql-tag';
import { QueryMiddleware, QueryPostMiddlewareState, QueryPreMiddlewareState } from '../types/hookMiddleware';
import { HasuraDataConfig } from '../types/hasuraConfig';
import { JsonObject } from 'type-fest';
import { buildFragment } from './support/buildFragment';
import { buildDocument } from './support/buildDocument';
import { getFieldTypeMap } from 'support';

interface IUseQueryOne {
  sharedConfig: HasuraDataConfig;
  middleware: QueryMiddleware[];
  initialVariables?: JsonObject;
}

function createVariableDefinitionsString(variables: JsonObject, config: HasuraDataConfig): string {
  if (!config.fieldFragment || !config.schema) {
    return '';
  }
  const fieldTypeMap = getFieldTypeMap(config.fieldFragment, config.schema);
  return Object.keys(variables)
    .map((key) => {
      const type = fieldTypeMap[key]?.toString() || 'Any!';
      return `$${key}:${type}`;
    })
    .join(', ');
}

export function createQueryOne<TData extends JsonObject, TVariables extends JsonObject>(
  state: QueryPreMiddlewareState,
  config: HasuraDataConfig,
): QueryPostMiddlewareState {
  const name = config.typename;
  const operationName = config.overrides?.operationNames?.query_by_pk ?? `${name}_by_pk`;

  const { fragment, fragmentName } = getFieldFragmentInfo(config, config.overrides?.fieldFragments?.query_by_pk);

  const variables = state.variables;

  for (const key of config.primaryKey) {
    if (!variables[key]) {
      throw new Error(`no value for primary key ${key}`);
    }
  }

  const operationStrBase = config.primaryKey
    .map((key) => {
      return variables[key] ? `${key}: $${key}` : null;
    })
    .filter((x) => !!x)
    .join(', ');

  const operationStr = operationStrBase ? `(${operationStrBase})` : '';
  const variableDefinitionsString = createVariableDefinitionsString(variables, config);

  let frag = buildFragment(fragment, operationStr, variables);

  const queryString = `query ${name}Query(${variableDefinitionsString}) {
    ${operationName}${operationStr} {
      ...${fragmentName}
    }
  }
  ${frag}`;

  console.log('🚀 ~ file: useQueryOne.utils.tsx ~ line 1 ~ queryString', queryString, variables);

  const document = buildDocument(queryString, operationStr, variables, 'createQueryOne', 'query');

  return { document, operationName, variables: {} ?? {} };
}
