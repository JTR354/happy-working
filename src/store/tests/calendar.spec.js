import { describe, it, expect } from "vitest";
import { getMonthDays, getMonthList } from "../calendar";

describe("calendar", () => {
  it("How many days in this month", () => {
    const days = getMonthDays(2024, 3);
    expect(days).toBe(30);
  });
  it.only("We get the list of month days", () => {
    const daysList = getMonthList(2024, 3);
    console.log(daysList);
    expect(daysList).toEqual([
      -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30, -1, -1, -1, -1,
    ]);
  });
});
