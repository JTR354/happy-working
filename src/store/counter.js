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

// console.log(new Date("2024-04-01").getDay(), 9e9);
const getTime = (t = Date.now()) => {
  const time = new Date(t);
  return [time.getFullYear(), String(time.getMonth() + 1).padStart(2, "0")];
};
export const getMonthMap = (time = "") => {
  const days = getDaysOfMonth(time);
  const [year, month] = getTime();
  const result = [];
  let j = 0;
  for (let i = 1; i <= days; i++) {
    const today = new Date(
      `${year}-${month}-${String(i).padStart(2, "0")}`
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
  const date = new Date(time)?.getDate();
  const map = getMonthMap(time);
  let k = 1,
    i = 0;
  outer: for (; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      k++;
      if (k >= date) {
        break outer;
      }
    }
  }
  const ddd = map[i].filter((v) => v > 0 && v < 6).length * 0.4;
  return Math.ceil(ddd);
};

export const showTime = () => {
  const time = new Date();
  const config = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return `${time.toLocaleDateString()} ${config[time.getDay()]}.`;
};
