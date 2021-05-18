import gql from 'graphql-tag';
import { JsonObject } from 'type-fest';

export function buildDocument(
  queryStr: string,
  operationName: string,
  variables: JsonObject,
  origin: string,
  type: 'query' | 'mutation',
) {
  let document;
  try {
    document = gql(queryStr);
  } catch (err) {
    console.log(
      `---!!! Could not parse ${type.toUpperCase()} string ( ${origin} ) !!!---
      message: ${err.message}

      ${type}Str: ${queryStr}

      operationName: ${operationName}

      variables: ${JSON.stringify(variables,null, 2)}

      ---!!! Could not parse ${type.toUpperCase()} string !!!---
    `,
      err,
    );
    throw err;
  }
  return document;
}
