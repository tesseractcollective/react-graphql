import {getFieldFragmentInfo} from '../support/HasuraConfigUtils';
import {print} from 'graphql';
import gql from 'graphql-tag';
import {
  QueryPostMiddlewareState,
  QueryPreMiddlewareState,
} from '../types/hookMiddleware';
import {HasuraDataConfig} from '../types/hasuraConfig';

function createPkArgsString(state: QueryPreMiddlewareState, config: HasuraDataConfig): string {
  return config.primaryKey
    .map((key) => {
      const variable = state.variables?.[key];
      return `${key}:${variable.type}`;
    })
    .join(', ');
}

function createVariableArgsString(state: QueryPreMiddlewareState, objectType: string): string {
  return Object.keys(state.variables).map((key) => {
    const variable = state.variables[key];
    if (key === 'item') {
      return `$object:${objectType}`;
    }
    return `$${key}:${variable.type}`;
  }).join(', ');
}

export function createDeleteMutation(
  state: QueryPreMiddlewareState,
  config: HasuraDataConfig,
): QueryPostMiddlewareState {
  const name = config.typename;
  const operationName =
    config.overrides?.operationNames?.delete_by_pk ?? `delete_${name}_by_pk`;

  const {fragment, fragmentName} = getFieldFragmentInfo(
    config,
    config.overrides?.fieldFragments?.delete_by_pk,
  );

  const pkArgs = createPkArgsString(state, config);

  const mutationStr = `mutation ${name}DeleteMutation {
      ${operationName}(${pkArgs}) {
        ...${fragmentName}
      }
    }
    ${print(fragment)}`;
  const document = gql(mutationStr);

  return {document, operationName, variables: state.variables};
}

export function createInsertMutation(
  state: QueryPreMiddlewareState,
  config: HasuraDataConfig,
): QueryPostMiddlewareState {
  const name = config.typename;
  const {fragment, fragmentName} = getFieldFragmentInfo(
    config,
    config.overrides?.fieldFragments?.insert_core_one,
  );

  const objectType = `${name}_insert_input!`;
  const variableArgsString = createVariableArgsString(state, objectType);
  const onConflictVariable = config.overrides?.onConflict?.insert
    ? `, $onConflict:${name}_on_conflict`
    : '';
  const onConflictArg = config.overrides?.onConflict?.insert_args
    ? ', on_conflict:$onConflict'
    : '';

  const operationName =
    config.overrides?.operationNames?.insert_one ?? `insert_${name}_one`;
  const mutationStr = `mutation ${name}Mutation(${variableArgsString}${onConflictVariable}) {
    ${operationName}(object:$object${onConflictArg}) {
      ...${fragmentName}
    }
  }
  ${print(fragment)}`;
  const document = gql(mutationStr);

  const { item, ...rest } = state.variables;
  item.name = 'object';
  const variables = {
    ...rest,
    object: item,
  };
  return {document, operationName, variables};
}

export function createUpdateMutation(
  state: QueryPreMiddlewareState,
  config: HasuraDataConfig,
): QueryPostMiddlewareState {
  const name = config.typename;
  const {fragment, fragmentName} = getFieldFragmentInfo(
    config,
    config.overrides?.fieldFragments?.update_core,
  );

  const operationName =
    config.overrides?.operationNames?.update_by_pk ?? `update_${name}_by_pk`;

  const objectType = `${name}_set_input!`;
  const variableArgsString = createVariableArgsString(state, objectType);

  const pkArgs = createPkArgsString(state, config);

  const mutationStr = `mutation ${name}Mutation(${variableArgsString}) {
    ${operationName}(pk_columns: {${pkArgs}} _set:$object ) {
      ...${fragmentName}
    }
  }
  ${print(fragment)}`;

  const document = gql(mutationStr);

  const { item, ...rest } = state.variables;
  item.name = 'object';
  delete item.value.id;
  const variables = {
    ...rest,
    object: item,
  };
  return {document, operationName, variables};

  return {document, operationName, variables: state.variables};
}
