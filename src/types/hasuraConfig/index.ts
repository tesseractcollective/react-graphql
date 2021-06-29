import { DocumentNode, GraphQLOutputType, GraphQLSchema } from 'graphql';
import { IFieldOutputType } from '../../support';

export interface HasuraConfigType {
  [key: string]: HasuraDataConfig;
}

export interface HasuraDataConfig {
  typename: string;
  primaryKey: string[];
  fieldFragment: DocumentNode;
  schema?: GraphQLSchema;
  primaryKeyRequiredOnCreate?: boolean;
  instanceId?: string;
  fields?: { 
    fieldSimpleMap: { [key: string]: IFieldOutputType } 
    fieldTypeMap: { [key: string]: GraphQLOutputType}
  };
  overrides?: {
    operationNames?: {
      query_many?: string;
      query_aggregate?: string;
      query_by_pk?: string;
      delete_by_pk?: string;
      insert_many?: string;
      insert_one?: string;
      update_by_pk?: string;
    };
    onConflict?: {
      insert?: string;
      insert_args?: string;
    };
    fieldFragments?: {
      query_many?: DocumentNode;
      query_aggregate?: DocumentNode;
      query_by_pk?: DocumentNode;
      delete_by_pk?: DocumentNode;
      insert?: DocumentNode;
      insert_core_one?: DocumentNode;
      update_core?: DocumentNode;
    };
  };
}
