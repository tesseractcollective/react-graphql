import { waitFor } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks/dom";

import HasuraConfig from "./TestHasuraConfig";
import { useReactGraphql } from "../src/hooks/useReactGraphql";
import { wrapperWithResultValue } from "./urqlTestUtils";

const resultValue = { id: "123" };

describe("useInsert", () => {
  it("sets up an insert", async () => {
    const wrapper = wrapperWithResultValue(resultValue, "mutation");

    const { result } = renderHook(
      () => {
        const reactGraphql = useReactGraphql(HasuraConfig.groups);
        return reactGraphql.useInsert();
      },
      { wrapper }
    );
    expect(result.current.resultItem).toBeUndefined();

    await waitFor(() => result.current.executeMutation());
    expect(result.current.resultItem.id).toBe(resultValue.id);
  });

  it("inserts with updating item values", async () => {
    const wrapper = wrapperWithResultValue(resultValue, "mutation");

    const { result } = renderHook(
      () => {
        const reactGraphql = useReactGraphql(HasuraConfig.groups);
        return reactGraphql.useInsert({ initialItem: { id: "456" } });
      },
      { wrapper }
    );
    expect(result.current.resultItem).toBeUndefined();

    act(() => {
      result.current.setItemValue("postId", "897");
    });

    await waitFor(() => result.current.executeMutation({ groupId: "123" }));
    expect(result.current.resultItem.id).toBe("456");
    expect(result.current.resultItem.postId).toBe("897");
    expect(result.current.resultItem.groupId).toBe("123");
  });

  it("throws an error if insert doesn't have required primary key", async () => {
    const wrapper = wrapperWithResultValue(resultValue, "mutation");

    const { result } = renderHook(
      () => {
        const reactGraphql = useReactGraphql(HasuraConfig.userGroups);
        return reactGraphql.useInsert();
      },
      { wrapper }
    );

    await waitFor(() => result.current.executeMutation()).catch(error => {
      expect(error.message).toContain('No value for required primary key');
    });
  });

  it("inserts with updating item values and variables", async () => {
    const wrapper = wrapperWithResultValue(resultValue, "mutation");

    const { result } = renderHook(
      () => {
        const reactGraphql = useReactGraphql(HasuraConfig.groups);
        return reactGraphql.useInsert();
      },
      { wrapper }
    );
    expect(result.current.resultItem).toBeUndefined();

    act(() => {
      result.current.setItemValue("userId", "8a8a");
      result.current.setVariable("userId", "8a8a");
    });

    await waitFor(() => result.current.executeMutation());
    expect(result.current.resultItem.userId).toBe("8a8a");
    expect(result.current.variables.userId).toBeDefined();
  });
});


describe("useUpdate", () => {
  it("sets up an update", async () => {
    const wrapper = wrapperWithResultValue(resultValue, "mutation");

    const { result } = renderHook(
      () => {
        const reactGraphql = useReactGraphql(HasuraConfig.groups);
        return reactGraphql.useUpdate({ initialItem: { id: '666' } });
      },
      { wrapper }
    );
    expect(result.current.resultItem).toBeUndefined();
    expect(result.current.mutationConfig.variables.id).toBe('666');

    await waitFor(() => result.current.executeMutation());
    expect(result.current.resultItem.id).toBe('666');
  });
});

describe("useDelete", () => {
  it("sets up a delete", async () => {
    const wrapper = wrapperWithResultValue(resultValue, "mutation");

    const { result } = renderHook(
      () => {
        const reactGraphql = useReactGraphql(HasuraConfig.groups);
        return reactGraphql.useDelete({ variables: { id: '666' } });
      },
      { wrapper }
    );
    expect(result.current.resultItem).toBeUndefined();
    expect(result.current.mutationConfig.variables.id).toBe('666');

    await waitFor(() => result.current.executeMutation());
    expect(result.current.resultItem.id).toBe('666');
  });
});
