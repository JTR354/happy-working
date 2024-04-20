import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const CALENDAR_TYPE = {
  disabled: -1,
};

export const dateToJson = (date) => {
  const result = {};
  if (date instanceof Date) {
    result.year = date.getFullYear();
    result.month = date.getMonth();
    result.date = date.getDate();
  }
  return result;
};

export const getTime = (...args) => new Date(...args) || new Date();

export const getMonthDays = (...args) => {
  const time = getTime(...args);
  const { year, month } = dateToJson(time);
  return new Date(year, month + 1, 0).getDate();
};

export const getMonthList = (...args) => {
  const days = getMonthDays(...args);
  const { year, month } = dateToJson(getTime(...args));
  const firstDay = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month, days).getDay();
  const result = new Array(days).fill(0).map((_, i) => i + 1);
  return new Array(firstDay - 0)
    .fill(-1)
    .concat(result)
    .concat(new Array(6 - lastDay).fill(-1));
};

export const useCalendarStore = create(
  immer((set) => {
    return {
      calendar: getMonthList(),
    };
  })
);
