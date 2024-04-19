import { describe, it, expect } from "vitest";
import { useStore } from "../counter";
import { renderHook, act } from "@testing-library/react";

describe("init project", () => {
  it("test react hook environment", () => {
    const { result } = renderHook(useStore);
    act(() => {
      result.current.increasePopulation();
    });
    expect(result.current.bears).toBe(1);
  });
});
