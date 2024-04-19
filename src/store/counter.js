import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const getDaysOfMonth = (time = "") => {
  const date = new Date(time);
  const dayOfMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  return dayOfMonth;
};

export const getWorkingDaysOfMonth = (time = "") => {
  const days = getMonthMap(time).toString().split(",");
  return days.filter((v) => v > 0 && v < 6).length;
};

export const getMonthMap = (time = "") => {
  const days = getDaysOfMonth(time);
  const tt = new Date();
  const result = [];
  let j = 0;
  for (let i = 1; i <= days; i++) {
    const today = new Date(
      `${tt.getFullYear()}-${tt.getMonth() + 1}-${i}`
    ).getDay();
    if (today === 0) {
      j++;
    }
    if (!result[j]) {
      result[j] = [];
    }
    result[j].push(today);
  }
  return result;
};

export const getWFOfMonth = (time = "") => {
  const d = getWorkingDaysOfMonth(time);
  return Math.ceil(d * 0.4);
};

export const getWFOfWeek = (time = "") => {
  // 获取当前日期
  const date = new Date(time);

  // 获取当前年份
  const year = date.getFullYear();

  // 获取当前月份
  const month = date.getMonth() + 1;

  // 获取当前日期是星期几，0 表示星期日，1 表示星期一，以此类推
  const dayOfWeek = date.getDay();

  // 获取当月的第一天是星期几
  const firstDayOfMonth = new Date(year, month - 1);
  const firstDayOfWeekOfMonth = firstDayOfMonth.getDay();

  // 获取当前日期是当月的第几天
  const dayOfMonth = date.getDate();

  // 计算当前日期是当月的第几周
  const weekOfMonth = Math.ceil(
    (dayOfMonth + firstDayOfWeekOfMonth - dayOfWeek) / 7
  );
  const map = getMonthMap(time);
  const ddd = map[weekOfMonth - 1].filter((v) => v > 0 && v < 6).length * 0.4;
  return Math.ceil(ddd);
};

export const showTime = () => {
  const time = new Date();
  const config = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return `${time.toLocaleDateString()} ${config[time.getDay()]}.`;
};

export const useCounter = create(
  immer((set) => ({
    days: 0,
    showTime: showTime(),
    dayOfWeek: getWFOfWeek(new Date()),
    dayOfMonth: getWFOfMonth(new Date()),
    getCurrentWorkingDays() {
      set((state) => {
        state.days = 1;
      });
    },
  }))
);
