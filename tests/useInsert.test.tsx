import { waitFor } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks/dom";

import HasuraConfig from "./TestHasuraConfig";
import { useReactGraphql } from "../src/hooks/useReactGraphql";
import { wrapperWithResultValue } from "./urqlTestUtils";

const resultValue = { id: '123' };

describe("useInsert", () => {

  it("sets up an insert", async () => {
    const wrapper = wrapperWithResultValue(resultValue, 'mutation');

    const { result } = renderHook(() => {
      const reactGraphql = useReactGraphql(HasuraConfig.groups);
      return reactGraphql.useInsert({});
    }, { wrapper });
    expect(result.current.resultItem).toBeUndefined();

    await waitFor(() => result.current.executeMutation());
    expect(result.current.resultItem.id).toBe(resultValue.id);
  });

  it("inserts with updating object values", async () => {
    const wrapper = wrapperWithResultValue(resultValue, 'mutation');

    const { result } = renderHook(() => {
      const reactGraphql = useReactGraphql(HasuraConfig.groups);
      return reactGraphql.useInsert({ initialItem: { id: "456" } });
    }, { wrapper });
    expect(result.current.resultItem).toBeUndefined();

    act(() => {
      result.current.setItemValue('postId', '897');
    });

    await waitFor(() => result.current.executeMutation({ groupId: '123' }));
    expect(result.current.resultItem.id).toBe("456");
    expect(result.current.resultItem.postId).toBe('897');
    expect(result.current.resultItem.groupId).toBe("123");
  });
});