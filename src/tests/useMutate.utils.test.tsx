import { createInsertMutation } from "hooks/useMutate.utils";
import { JsonObject } from "type-fest";
import HasuraConfig from "./TestHasuraConfig";

describe("useMutateMiddleware", () => {
  it("creates insert middleware", () => {
    const state = { variables: { reaction: "LIKE" } };
    const insertMiddleware = createInsertMutation(
      state,
      HasuraConfig.userPostReactions
    );
    expect(insertMiddleware.variables.object).toBeDefined();
    expect((insertMiddleware.variables.object as JsonObject)?.reaction).toEqual(
      "LIKE"
    );
  });
});
