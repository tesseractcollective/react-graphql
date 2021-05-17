import { getFieldFragmentInfo } from '../support/HasuraConfigUtils';
import { print } from 'graphql';
import gql from 'graphql-tag';
import { QueryPostMiddlewareState, QueryPreMiddlewareState } from '../types/hookMiddleware';
import { HasuraDataConfig } from '../types/hasuraConfig';
import { JsonObject } from 'type-fest';
import { getFieldTypeMap } from 'support';

function createPkArgsString(config: HasuraDataConfig): string {
  return config.primaryKey
    .map((key) => {
      return `${key}:$${key}`;
    })
    .join(', ');
}

function createVariableDefinitionsString(variables: JsonObject, objectType: string, config: HasuraDataConfig): string {
  if (!config.fieldFragment || !config.schema) {
    return '';
  }
  const fieldTypeMap = getFieldTypeMap(config.fieldFragment, config.schema);
  return Object.keys(variables)
    .map((key) => {
      if (key === 'object') {
        return `$${key}:${objectType}`;
      }
      const type = fieldTypeMap[key]?.toString() || 'Any!';
      return `$${key}:${type}`;
    })
    .join(', ');
}

function createVariables(
  state: QueryPreMiddlewareState,
  config: HasuraDataConfig,
  operationName: string,
  includePks: boolean = false,
): JsonObject {
  const variables: JsonObject = {};

  config.primaryKey.forEach((key) => {
    const item: any = state.variables.item;
    const value = item && item[key];
    if (!value && includePks) {
      throw new Error(`No value for required primary key ${key} for operation ${operationName}`);
    }

    if (value) {
      variables[key] = value;
    }
  });

  Object.keys(state.variables).forEach((key) => {
    const variable = state.variables[key];
    if (key === 'item') {
      if (variable) {
        variables.object = variable;
      }
    } else {
      variables[key] = variable;
    }
  });

  return variables;
}

export function createDeleteMutation(
  state: QueryPreMiddlewareState,
  config: HasuraDataConfig,
): QueryPostMiddlewareState {
  const name = config.typename;
  const operationName = config.overrides?.operationNames?.delete_by_pk ?? `delete_${name}_by_pk`;

  const { fragment, fragmentName } = getFieldFragmentInfo(config, config.overrides?.fieldFragments?.delete_by_pk);

  const variables = createVariables(state, config, operationName);
  const variableDefinitionsString = createVariableDefinitionsString(variables, 'Any!', config);
  const pkArgs = createPkArgsString(config);

  const mutationStr = `mutation ${name}DeleteMutation(${variableDefinitionsString}) {
      ${operationName}(${pkArgs}) {
        ...${fragmentName}
      }
    }
    ${print(fragment)}`;
  const document = gql(mutationStr);

  return { document, operationName, variables };
}

export function createInsertMutation(
  state: QueryPreMiddlewareState,
  config: HasuraDataConfig,
): QueryPostMiddlewareState {
  const name = config.typename;
  const { fragment, fragmentName } = getFieldFragmentInfo(config, config.overrides?.fieldFragments?.insert_core_one);

  const operationName = config.overrides?.operationNames?.insert_one ?? `insert_${name}_one`;
  const objectType = `${name}_insert_input!`;
  const variables = createVariables(state, config, operationName, config.primaryKeyRequiredOnCreate);
  const variableDefinitionsString = createVariableDefinitionsString(variables, objectType, config);
  const onConflictVariable = config.overrides?.onConflict?.insert ? `, $onConflict:${name}_on_conflict` : '';
  const onConflictArg = config.overrides?.onConflict?.insert_args ? ', on_conflict:$onConflict' : '';

  const variablesString =
    variableDefinitionsString || onConflictVariable ? `(${variableDefinitionsString}${onConflictVariable})` : '';

  const mutationStr = `mutation ${name}Mutation${variablesString} {
    ${operationName}(object:$object${onConflictArg}) {
      ...${fragmentName}
    }
  }
  ${print(fragment)}`;

  const document = gql(mutationStr);

  return { document, operationName, variables };
}

export function createUpdateMutation(
  state: QueryPreMiddlewareState,
  config: HasuraDataConfig,
): QueryPostMiddlewareState {
  const name = config.typename;
  const { fragment, fragmentName } = getFieldFragmentInfo(config, config.overrides?.fieldFragments?.update_core);

  const operationName = config.overrides?.operationNames?.update_by_pk ?? `update_${name}_by_pk`;

  const objectType = `${name}_set_input!`;
  const variables = createVariables(state, config, operationName);
  const variableDefinitionsString = createVariableDefinitionsString(variables, objectType, config);
  const pkArgs = createPkArgsString(config);

  const mutationStr = `mutation ${name}Mutation(${variableDefinitionsString}) {
    ${operationName}(pk_columns: {${pkArgs}} _set:$object ) {
      ...${fragmentName}
    }
  }
  ${print(fragment)}`;

  const document = gql(mutationStr);

  return { document, operationName, variables };
}
