import { DocumentNode, print } from "graphql";
import { JsonObject } from "type-fest";
import { log } from "../../support/log";

export function buildFragment(
  fragment: DocumentNode,
  operationName: string,
  variables: JsonObject
) {
  let frag;
  try {
    frag = print(fragment);
  } catch (err: any) {
    log.error(
      `---!!! Could not parse FRAGMENT string ( useInfiniteQueryMany )  !!!---
    message: ${err.message}

    fragment: ${fragment}

    operationName: ${operationName}

    variables: ${variables}

    ---!!! Could not parse query string !!!---
  `,
      err
    );
    throw err;
  }
  return frag;
}
