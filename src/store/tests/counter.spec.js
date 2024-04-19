import { describe, it, expect } from "vitest";
import {
  getDaysOfMonth,
  getWorkingDaysOfMonth,
  getMonthMap,
  getWFOfMonth,
  getWFOfWeek,
} from "../counter";
import { renderHook, act } from "@testing-library/react";

describe("calc working days", () => {
  it("get current month days", () => {
    expect(getDaysOfMonth("2024-01")).toBe(31);
    expect(getDaysOfMonth("2024-02")).toBe(29);
    expect(getDaysOfMonth("2024-03")).toBe(31);
    expect(getDaysOfMonth("2024-04")).toBe(30);
    expect(getDaysOfMonth("2024-05")).toBe(31);
    expect(getDaysOfMonth("2024-06")).toBe(30);
    expect(getDaysOfMonth("2024-07")).toBe(31);
    expect(getDaysOfMonth("2024-08")).toBe(31);
    expect(getDaysOfMonth("2024-09")).toBe(30);
    expect(getDaysOfMonth("2024-10")).toBe(31);
    expect(getDaysOfMonth("2024-11")).toBe(30);
    expect(getDaysOfMonth("2024-12")).toBe(31);
  });
  it("get month map", () => {
    expect(getMonthMap("2024-04")).toEqual([
      [1, 2, 3, 4, 5, 6],
      [0, 1, 2, 3, 4, 5, 6],
      [0, 1, 2, 3, 4, 5, 6],
      [0, 1, 2, 3, 4, 5, 6],
      [0, 1, 2],
    ]);
  });
  it("get current month working days", () => {
    expect(getWorkingDaysOfMonth("2024-04")).toBe(22);
  });
  it("get WFO of month", () => {
    expect(getWFOfMonth("2024-04")).toBe(9);
  });
  it("get WFO of week", () => {
    console.log(new Date().toLocaleDateString(), new Date().toLocaleString());
    expect(getWFOfWeek("2024-04-01")).toBe(2);
    expect(getWFOfWeek("2024-04-08")).toBe(2);
    expect(getWFOfWeek("2024-04-15")).toBe(2);
    expect(getWFOfWeek("2024-04-22")).toBe(2);
    expect(getWFOfWeek("2024-04-29")).toBe(1);
  });
});
