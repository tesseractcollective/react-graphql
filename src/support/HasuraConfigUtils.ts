// //THESE ARE THE 4 CORE SCENARIOS
// SingleItem (single item)
// Button | Function (delete)
// PaginatedList (many)
// Form (insert & updates)

import { buildClientSchema, DocumentNode, IntrospectionQuery } from 'graphql';
import { JsonObject } from 'type-fest';
import { HasuraConfigType, HasuraDataConfig } from '../types/hasuraConfig';
import { getFragmentFields, getFragmentName } from './graphqlHelpers';

export const keyExtractor = (config: HasuraDataConfig, item: { [key: string]: any }): string => {
  return config.primaryKey.map((key) => item[key]).join(':');
};

export const getFieldFragmentInfo = (
  config: HasuraDataConfig,
  override?: DocumentNode,
): { fragment: DocumentNode; fragmentName: string } => {
  const fragment = override || config.fieldFragment;
  const fragmentName = getFragmentName(fragment);
  if (!fragmentName) {
    throw new Error('DocumentNode set as fieldFragment is not a fragment');
  }
  return { fragment, fragmentName };
};

// export function addFieldsToConfig(config: HasuraDataConfig, schema: JsonObject){
//   Object.values(config).forEach((tableConfig) => {
//     if (!tableConfig.fieldFragment) return;

//     const fields = getFragmentFields(tableConfig.fieldFragment, schema);
//     tableConfig.fieldNames = Object.keys(fields.fieldTypeMap || {});
//     tableConfig.fields = fields;
//   });
// }

export function buildHasuraConfig(schema: JsonObject, config: HasuraConfigType): HasuraConfigType {
  const schemaConverted = buildClientSchema(schema as unknown as IntrospectionQuery);

  Object.values(config).forEach((tableConfig) => {
    if (!tableConfig.fieldFragment) return;

    tableConfig.schema = schemaConverted;

    try{
      const fields = getFragmentFields(tableConfig.fieldFragment, schemaConverted);
      tableConfig.fields = fields;
    } catch(err){
      console.log('react-graphql: ERR: failed to parse fields against schema.  Please ensure your schema.json file matches your fragment definitions. You most likely need to re-run the generator, or update your fragments.')
    }
  });
  return config;
}
