import { createInsertMutation } from "../src/hooks/useMutate.utils";
import HasuraConfig from "./TestHasuraConfig";

describe("useMutateMiddleware", () => {
  it("creates insert middleware", () => {
    const state = {
      variables: {
        item: { name: "item", value: { reaction: "LIKE" }, type: "" },
      }
    };
    const insertMiddleware = createInsertMutation(
      state,
      HasuraConfig.userPostReactions
    );
    expect(insertMiddleware.variables.object).toBeDefined();
    expect((insertMiddleware.variables.object.value)?.reaction).toEqual(
      "LIKE"
    );
  });
});
