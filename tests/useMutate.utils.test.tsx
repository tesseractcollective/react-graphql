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

    const mutation = `mutation userPostReactionMutation($userId: Any!, $postId: Any!, $item: userPostReaction_insert_input!) {
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
    expect(print(insertMiddleware.document)).toEqual(mutation);
    expect(insertMiddleware.variables.object).toBeDefined();
    expect((insertMiddleware.variables.object as any).reaction).toEqual(
      "LIKE"
    );
  });
});
