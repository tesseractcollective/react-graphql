import { JsonArray, JsonObject } from 'type-fest';
import {
  DocumentNode,
  GraphQLFieldMap,
  GraphQLOutputType,
  GraphQLSchema,
  isListType,
  isNonNullType,
  isObjectType,
  isScalarType,
  VariableDefinitionNode,
} from 'graphql';
import { HasuraDataConfig } from 'types';

export type GraphQLOutputTypeMap = { [key: string]: GraphQLOutputType };

export function isMutation(document: DocumentNode) {
  const node = document.definitions[0];
  return node?.kind === 'OperationDefinition' && node.operation === 'mutation';
}

export function isQuery(document: DocumentNode) {
  const node = document.definitions[0];
  return node?.kind === 'OperationDefinition' && node.operation === 'query';
}

export function isFragment(document: DocumentNode) {
  const node = document.definitions[0];
  return node?.kind === 'FragmentDefinition';
}

export function getVariableDefinition(document: DocumentNode, name: string): VariableDefinitionNode | undefined {
  return getVariableDefinitions(document)?.find((d) => d.variable.name.value === name);
}

export function getVariableDefinitions(document: DocumentNode): ReadonlyArray<VariableDefinitionNode> | undefined {
  for (const definition of document.definitions) {
    if (definition.kind === 'OperationDefinition') {
      return definition.variableDefinitions;
    }
  }
  return undefined;
}

export function getFragmentName(document: DocumentNode): string | undefined {
  for (const definition of document.definitions) {
    if (definition.kind === 'FragmentDefinition') {
      return definition.name.value;
    }
  }
  return undefined;
}

export function getFragmentTypeName(document: DocumentNode): string | undefined {
  for (const definition of document.definitions) {
    if (definition.kind === 'FragmentDefinition') {
      return definition.typeCondition.name.value;
    }
  }
  return undefined;
}

export interface IFieldOutputType {
  table: string;
  name: string;
  typeName: string;
  isNonNull?: boolean;
  isObject?: boolean;
  isList?: boolean;
  data?: any;
  relationship?: { table: string; field: string };
}

export function getFieldMap(document: DocumentNode, schema: GraphQLSchema): GraphQLFieldMap<any, any> {
  const typeName = getFragmentTypeName(document);
  if (!typeName) {
    return {};
  }
  const type = schema.getType(typeName);
  if (!isObjectType(type)) {
    return {};
  }
  return type.getFields();
}

function typeMapFromFieldMap(fieldMap: GraphQLFieldMap<any, any>): GraphQLOutputTypeMap {
  const typeMap: GraphQLOutputTypeMap = {};
  for (const key in fieldMap) {
    typeMap[key] = fieldMap[key].type;
  }
  return typeMap;
}

export function getFieldTypeMap(document: DocumentNode, schema: GraphQLSchema): GraphQLOutputTypeMap {
  const fieldMap = getFieldMap(document, schema);
  return typeMapFromFieldMap(fieldMap);
}

export function getFragmentFields(
  document: DocumentNode,
  schema: GraphQLSchema,
  relationshipLookup: Record<string,string> | null,
): { fieldTypeMap: { [key: string]: GraphQLOutputType }; fieldSimpleMap: { [key: string]: any } } {
  const fieldTypeMap: { [key: string]: GraphQLOutputType } = {};

  const fieldSimpleMap: { [key: string]: IFieldOutputType } = {};
  const typeName = getFragmentTypeName(document);
  if (!typeName) {
    return {
      fieldTypeMap: {},
      fieldSimpleMap: {},
    };
  }

  const allFields = getFieldMap(document, schema);    

  for (const definition of document.definitions) {
    if (definition.kind === 'FragmentDefinition') {
      const fields = definition.selectionSet.selections;
      const tableName = definition.typeCondition.name.value;
      for (const field of fields) {
        if (field.kind === 'Field') {
          const fieldName = field.name.value;
          const graphQlField = allFields[fieldName];
          fieldTypeMap[fieldName] = graphQlField.type;

          // const isRelationship = metadata ? metadata. : null;
          // // in the caller
          let fieldType = graphQlField.type;
          let isNonNull = false;
          if (isNonNullType(fieldType)) {
            isNonNull = true;
            fieldType = fieldType.ofType;
          }

          if (isScalarType(fieldType)) {
            let relationship;
            if (relationshipLookup) {
              const rel = relationshipLookup[tableName+ '.' + fieldName];
              if (rel) {
                const relArr = rel.split(':');
                relationship = {
                  table: relArr[0],
                  field: relArr[1],
                };
              }
            }
            // make a scalar form field
            fieldSimpleMap[fieldName] = {
              table: tableName,
              name: fieldName,
              typeName: fieldType.name,
              isNonNull,
              relationship,
            };
          } else if (isObjectType(fieldType)) {
            let relationship;
            if (relationshipLookup) {
              const rel = relationshipLookup[tableName+ '.' + fieldName];
              if (rel) {
                const relArr = rel.split(':');
                relationship = {
                  table: relArr[0],
                  field: relArr[1],
                };
              }
            }
            // recurse
            fieldSimpleMap[fieldName] = {
              table: tableName,
              name: fieldName,
              typeName: fieldType.name,
              isObject: true,
              isNonNull,
              relationship,
            };
          } else if (isListType(fieldType)) {
            const innerType = fieldType.ofType;
            let relationship;
            if (relationshipLookup) {
              const rel = relationshipLookup[tableName + '.' + fieldName];
              if (rel) {
                const relArr = rel.split(':');
                relationship = {
                  table: relArr[0],
                  field: relArr[1],
                };
              }
            }
            // recurse
            fieldSimpleMap[fieldName] = {
              table: tableName,
              typeName: innerType,
              name: fieldName,
              isList: true,
              isNonNull,
              relationship,
            };
          }
        }
      }
    }
  }
  return { fieldTypeMap, fieldSimpleMap };
}

export function buildRelationshipMapFromMetadata(metaData: JsonArray, config: HasuraDataConfig[]): Record<string, string> {
  const metaDataMap: Record<string, string> = {};
  const missingTableNames = new Set<string>();

  metaData.forEach((metaDataTable: any) => {
    const tableName = metaDataTable?.table?.name;
    metaDataTable?.object_relationships?.forEach((relationship: any) => {
      const sourceFieldNameAsArrOrStr = relationship.using?.foreign_key_constraint_on;
      const sourceFieldName: string = Array.isArray(sourceFieldNameAsArrOrStr)
        ? sourceFieldNameAsArrOrStr.join('.')
        : sourceFieldNameAsArrOrStr;
      const sourceFieldNameFromManual = relationship.using?.manual_configuration;

      const sourceColumns = sourceFieldName ?? Object.keys(sourceFieldNameFromManual?.column_mapping).join('.');

      const targetTable = sourceFieldNameFromManual?.remote_table?.name ?? relationship.name;
      const targetField = sourceFieldNameFromManual?.column_mapping
        ? Object.keys(sourceFieldNameFromManual?.column_mapping)
            .map((x) => sourceFieldNameFromManual?.column_mapping[x])
            .join('.')
        : config.filter((cfg) => cfg.typename === tableName)?.[0]?.primaryKey.join('.');

      if (targetField) {
        metaDataMap[`${tableName}.${sourceColumns}`] = `${targetTable}:${targetField}`;
      } else {
        missingTableNames.add(tableName);
        metaDataMap[`${tableName}.${sourceColumns}`] = `${targetTable}:id`;
      }
    });

    metaDataTable?.array_relationships?.forEach((relationship: any) => {
      const sourceFieldName = relationship.using?.foreign_key_constraint_on?.column;
      const sourceFieldNameFromManual = relationship.using?.manual_configuration;

      const sourceColumns = sourceFieldName ?? Object.keys(sourceFieldNameFromManual?.column_mapping).join('.');

      const targetTable =
        sourceFieldNameFromManual?.remote_table?.name ?? relationship.using?.foreign_key_constraint_on?.table?.name;
      const targetField = sourceFieldNameFromManual?.column_mapping
        ? Object.keys(sourceFieldNameFromManual?.column_mapping)
            .map((x) => sourceFieldNameFromManual?.column_mapping?.[x])
            .join('.')
        : config
            .filter((cfg) => {
              return cfg.typename === tableName;
            })?.[0]
            ?.primaryKey.join('.');

      if (targetField) {
        metaDataMap[`${tableName}.${sourceColumns}`] = `${targetTable}:${targetField}`;
      } else {
        missingTableNames.add(`tableName`);
        metaDataMap[`${tableName}.${sourceColumns}`] = `${targetTable}:id`;
      }
    });
  });
  if(missingTableNames.size > 0){
    console.warn(`Config Missing Tablenames for relationships: ${Array.from(missingTableNames).join(', ')}. Used default id.  Add entries to your hasuraConfig with a typeName equal to these column names to specify other primary keys`);
  }

  return metaDataMap;
}

// function getInArrayRelationship(metaData: Record<string, string>, sourceTypeName: string, sourceFieldName: string): {
//   sourceTypeName: string;
//   sourceFieldName: string;
//   targetTypeName: string;
//   targetTypeFieldName: string
// } | null {
//   const myMeta = metaData.

//   return null;
// }

// function getInObjectRelationship(): {
//   name: string,
//   sourceFieldName: string;
//   targetTypeName: string;
//   targetTypeFieldName: string
// } | null  {

//   return null;
// }

export function hasVariableDefinition(document: DocumentNode, name: string) {
  return getVariableDefinition(document, name) !== undefined;
}

export function getResultFieldName(document: DocumentNode): string | undefined {
  const operation = document.definitions[0];
  if (operation?.kind === 'OperationDefinition') {
    const field = operation.selectionSet.selections[0];
    if (field?.kind === 'Field') {
      return field.name.value;
    }
  }
  return undefined;
}
