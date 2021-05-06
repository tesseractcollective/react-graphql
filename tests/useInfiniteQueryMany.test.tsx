import React from "react";
import { renderHook, act } from "@testing-library/react-hooks/dom";
import HasuraConfig from "./TestHasuraConfig";
import { useUrqlQueryMock } from "./mockUtils/useUrqlQuery";
jest.mock("../src/hooks/useUrqlQuery", () => ({
  useUrqlQuery: useUrqlQueryMock("groups1")
}));
import { useReactGraphql } from "../src/hooks/useReactGraphql";

describe("useInfiniteQueryMany", () => {
  it("runs with no setup and returns an empty array", () => {
    const { result } = renderHook(() => {
      const rh = useReactGraphql(HasuraConfig.groups);
      return rh.useInfiniteQueryMany({});
    });

    act(() => {});

    expect(result.current.items.length).toBe(0);
  });
});
