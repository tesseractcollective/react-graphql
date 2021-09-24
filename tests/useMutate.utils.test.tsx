import { print } from "graphql";
import { createInsertMutation } from "../src/hooks/useMutate.utils";
import HasuraConfig from "./TestHasuraConfig";

describe("useMutateMiddleware", () => {
  it("creates insert middleware", () => {
    const state = {
      variables: {
        item: { 
          postId: "123",
          userId: "456", 
          reaction: "LIKE",
        }
      }
    };

    const mutation = `mutation userPostReactionMutation($item: userPostReaction_insert_input!, $userId: Any!, $postId: Any!) {
  insert_userPostReaction_one(object: $item) {
    ...userPostReactionFields
  }
}

fragment userPostReactionFields on userPostReaction {
  userId
  postId
  reaction
}
`;

    const insertMiddleware = createInsertMutation(
      state,
      HasuraConfig.userPostReactions
    );
    const docStr = print(insertMiddleware.document);
    expect(docStr.indexOf('mutation')).toEqual(0);
    expect(docStr.indexOf('$item: userPostReaction_insert_input!')).toBeGreaterThan(0);
    expect(docStr.indexOf('$userId: uuid!')).toBeGreaterThan(0);
    expect(docStr.indexOf('$postId: uuid!')).toBeGreaterThan(0);
    expect(docStr.indexOf('insert_userPostReaction_one')).toBeGreaterThan(0);
    expect(docStr.indexOf('object: $item')).toBeGreaterThan(0);
    console.log('🚀 insertMiddleware.variables', insertMiddleware.variables)
    expect(insertMiddleware.variables.item).toBeDefined();    
    expect((insertMiddleware.variables.item as any).reaction).toEqual(
      "LIKE"
    );
  });
});
