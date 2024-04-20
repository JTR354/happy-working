import { describe, it, expect } from "vitest";
import {
  getMonthDays,
  getMonthList,
  getWFOInMonth,
  getEachWeekWFO,
  getMonthString,
  genKeyOfWFO,
  getWorkingDaysInMonth,
} from "../calendar";

describe("calendar", () => {
  it("How many days in this month", () => {
    const days = getMonthDays(2024, 3);
    expect(days).toBe(30);
  });
  it("We get the list of month days", () => {
    const [daysList] = getMonthList(2024, 3);
    expect(daysList).toEqual([
      -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30, -1, -1, -1, -1,
    ]);
  });
  it("We get this month string", () => {
    expect(getMonthString(2024, 3)).toBe("April 2024");
    expect(getMonthString(2024, -1)).toBe("December 2023");
    expect(getMonthString(2024, 12)).toBe("January 2025");
  });
  it("We get working days in this month", () => {
    const [daysList, year, month] = getMonthList(2024, 4);
    expect(getWorkingDaysInMonth(daysList, year, month)).toEqual([
      1, 2, 3, 6, 7, 8, 9, 10, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24, 27, 28,
      29, 30, 31,
    ]);
  });
  it("We get the WFO in this month", () => {
    const [daysList, year, month] = getMonthList(2024, 3);
    const wfoInMonth = getWFOInMonth(daysList, year, month);
    expect(wfoInMonth).toBe(9);
  });
  it("We get the WFO every week of each month", () => {
    const [daysList, year, month] = getMonthList(2024, 3);
    const wfoEachWeek = getEachWeekWFO(daysList, year, month);
    expect(wfoEachWeek).toEqual([
      [2, 1, 5],
      [2, 8, 12],
      [2, 15, 19],
      [2, 22, 26],
      [1, 29],
    ]);
  });
  it("it is collection of active days", () => {
    expect(genKeyOfWFO(2024, -1)).toBe("202311");
    expect(genKeyOfWFO(2024, 3)).toBe("20243");
    expect(genKeyOfWFO(2024, 12)).toBe("20250");
  });
  it("When we have the public holiday, We get working days in this month", () => {
    const [daysList, year, month] = getMonthList(2024, 4);
    expect(
      getWorkingDaysInMonth(daysList, year, month, { holiday: [1, 2] })
    ).toEqual([
      3, 6, 7, 8, 9, 10, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24, 27, 28, 29, 30,
      31,
    ]);
  });
  it("When we have the public holiday, we will get the WFO in this month", () => {
    const [daysList, year, month] = getMonthList(2024, 4);
    const wfoInMonth = getWFOInMonth(daysList, year, month, { holiday: ["1"] });
    expect(wfoInMonth).toBe(9);
  });
  it("When we have the public holiday, we will get the WFO in each week", () => {
    const [daysList, year, month] = getMonthList(2024, 4);
    const wfoEachWeek = getEachWeekWFO(daysList, year, month, {
      holiday: ["1"],
    });
    expect(wfoEachWeek).toEqual([
      [1, 3],
      [2, 6, 10],
      [2, 13, 17],
      [2, 20, 24],
      [2, 27, 31],
    ]);
  });
});
