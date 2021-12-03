import {DocumentNode} from 'graphql';
import { JsonObject } from 'type-fest';
import {HasuraDataConfig} from '../../types/hasuraConfig';

export interface QueryMiddleware {
  (
    state: QueryPreMiddlewareState,
    config: HasuraDataConfig,
  ): QueryPostMiddlewareState;
}

export interface QueryPreMiddlewareState {
  document?: DocumentNode;
  variables: JsonObject;
  operationName?: string;
  meta?: {
    jsonbColumnName?: string;
    operationEventType?: OperationTypes;
  };
}

export interface QueryPostMiddlewareState {
  document: DocumentNode;
  variables: JsonObject;
  operationName: string;
  meta?: any;
}

export type OperationTypes = "insert-first" | "insert-last" | "update" | "delete" | "delete_jsonb_key";