export const CALENDAR_TYPE = {
  disabled: -1,
  storageKey: "WFO",
  storageHolidayKey: "HOLIDAY",
  priorityInWeeks: [1, 5, 3, 2, 4],
  weekTemplate: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  monthTemplate: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

export const getMonthString = (...args) => {
  const { year, month } = dateToJson(getTime(...args));
  return `${CALENDAR_TYPE.monthTemplate[month % 12]} ${year}`;
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
export const getDay = (year, month, date) =>
  new Date(+year, +month, +date).getDay();

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
  return [
    new Array(firstDay - 0)
      .fill(-1)
      .concat(result)
      .concat(new Array(6 - lastDay).fill(-1)),
    year,
    month,
  ];
};

export const getWorkingDaysInMonth = (
  daysList,
  year,
  month,
  { holiday } = {}
) => {
  const result = daysList.filter((date) => {
    if (date !== CALENDAR_TYPE.disabled) {
      const day = getDay(year, month, date);
      return day > 0 && day < 6;
    }
  });
  if (Array.isArray(holiday) && holiday.length) {
    const r = result.filter((d) => !holiday.find((date) => +d === +date));
    return r;
  }
  return result;
};

export const getMiniWFO = (len) => Math.ceil(len * 0.4);

export const getWFOInMonth = (daysList, year, month, { holiday } = {}) => {
  const workingDays = getWorkingDaysInMonth(daysList, year, month, { holiday });
  return getMiniWFO(workingDays.length);
};

export const getWorkingDaysEachWeek = (
  daysList,
  year,
  month,
  { holiday } = {}
) => {
  const workingDays = getWorkingDaysInMonth(daysList, year, month, { holiday });
  const result = [];
  let j = 0;
  for (let i = 0; i < workingDays.length; i++) {
    if (
      getDay(year, month, workingDays[i]) <
      getDay(year, month, workingDays[i - 1])
    ) {
      j++;
    }
    result[j] = result[j] || [];
    result[j].push(workingDays[i]);
  }
  return result;
};

export const getEachWeekWFO = (daysList, year, month, { holiday } = {}) => {
  const workingDaysInWeeks = getWorkingDaysEachWeek(daysList, year, month, {
    holiday,
  });
  return workingDaysInWeeks.map((originWeekData) => {
    const result = [];
    const wfo = getMiniWFO(originWeekData.length);
    const weekData = {};
    originWeekData.forEach((date) => {
      weekData[getDay(year, month, date)] = date;
    });
    for (const day of CALENDAR_TYPE.priorityInWeeks) {
      if (result.length >= wfo) {
        break;
      }
      const hit = weekData[day];
      hit && result.push(hit);
    }
    result.unshift(wfo);
    return result;
  });
};

export const genKeyOfWFO = (...args) => {
  const { year, month } = dateToJson(getTime(...args));
  return `${year}${month}`;
};
