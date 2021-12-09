## Setup & run graphql code generator

## Set up config file
import schema from './generated/graphql.schema.json'; //comes from graphql-code-generator


### Set up the basics:
```
const HasuraConfig = buildHasuraConfig(
  schema,
  {
    typename: 'claim',
    primaryKey: ['id'],
    fieldFragment: ClaimFieldsFragmentDoc,
  }
```

### Other options

from react-graphql/src/types/hasuraConfig/index.d.ts

```
export interface HasuraDataConfig {
    typename: string;
    primaryKey: string[];
    fieldFragment: DocumentNode;
    schema?: GraphQLSchema;
    primaryKeyRequiredOnCreate?: boolean;
    instanceId?: string;
    relationshipMeta?: {
        labelField?: string;
        defaultWhere?: any;
    };
    excludeAggregate?: any;
    fields?: {
        fieldSimpleMap: {
            [key: string]: IFieldOutputType;
        };
        fieldTypeMap: {
            [key: string]: GraphQLOutputType;
        };
    };
    jsonb?: {
        columnName: string;
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
```