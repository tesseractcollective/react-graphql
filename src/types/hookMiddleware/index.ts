import {DocumentNode} from 'graphql';
import { VariableMap } from 'types/hasuraHooks';
import {HasuraDataConfig} from '../../types/hasuraConfig';

export interface QueryMiddleware {
  (
    state: QueryPreMiddlewareState,
    config: HasuraDataConfig,
  ): QueryPostMiddlewareState;
}

export interface QueryPreMiddlewareState {
  document?: DocumentNode;
  variables: VariableMap;
  operationName?: string;
}

export interface QueryPostMiddlewareState {
  document: DocumentNode;
  variables: VariableMap;
  operationName: string;
}
