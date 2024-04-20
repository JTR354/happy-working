/* eslint-disable react/prop-types */
import { createElement } from "react";
import cn from "classnames";
import "./Calendar.pcss";
import {
  getMonthDays,
  useCalendarStore,
  CALENDAR_TYPE,
} from "../store/calendar";

const days = getMonthDays("2024-04");
console.log(days);

const Cell = ({ children, element, ...props }) => {
  return createElement(
    element,
    props,
    <div>
      <div>{children}</div>
    </div>
  );
};

const Calendar = () => {
  const th = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const { calendar } = useCalendarStore();
  return (
    <div className="rounded-2xl bg-white p-7 ">
      <h1 className="flex font-black text-2xl pb-3">May 2023{days}</h1>
      <dl className="calendar ">
        {th.map((title) => {
          return (
            <Cell
              element="dt"
              className="font-sans text-sm font-semibold cell"
              key={title}
            >
              <div className="flex items-center justify-center">{title}</div>
            </Cell>
          );
        })}
        {calendar.map((date, index) => {
          return (
            <Cell
              element="dt"
              key={index}
              className={cn(
                "cell border font-light text-black",
                index === 100
                  ? "active"
                  : date === CALENDAR_TYPE.disabled
                  ? "disabled"
                  : "normal"
              )}
            >
              <button>{date === CALENDAR_TYPE.disabled ? "" : date}</button>
            </Cell>
          );
        })}
      </dl>
    </div>
  );
};
export default Calendar;
