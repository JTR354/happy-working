/* eslint-disable react/prop-types */
import { createElement, useState, useMemo, useCallback } from "react";
import cn from "classnames";
import "./Calendar.pcss";
import {
  CALENDAR_TYPE,
  getEachWeekWFO,
  getMonthList,
  getMonthString,
  dateToJson,
  genKeyOfWFO,
  getWFOInMonth,
} from "../store/calendar";
import ReactSVG from "../assets/react.svg";
import ViteSVG from "../../public/vite.svg";
import RightSVG from "../assets/chevron-right.svg";
import LeftSVG from "../assets/chevron-left.svg";
import { useEffect } from "react";

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
  const [time, setTime] = useState(() => new Date());
  const [calendar, header, year, month] = useMemo(() => {
    const [list, year, month] = getMonthList(time);
    return [list, getMonthString(year, month), year, month];
  }, [time]);
  const eachWeek = useMemo(() => {
    return getEachWeekWFO(calendar, year, month).reduce(
      (prev, cur) => cur.slice(1).concat(prev),
      []
    );
  }, [calendar, year, month]);
  const isToday = useCallback(
    (date) => {
      const currentTime = dateToJson(time);
      const today = dateToJson(new Date());
      return (
        today.year === currentTime.year &&
        today.month === currentTime.month &&
        today.date === date
      );
    },
    [time]
  );
  const [active, setActive] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem(CALENDAR_TYPE.storageKey)) || {};
    } catch (err) {
      console.log(err);
      return {};
    }
  });
  const activeKey = useMemo(() => {
    return genKeyOfWFO(time);
  }, [time]);

  const changeMonth = useCallback((dM) => {
    setTime((time) => {
      const { year, month } = dateToJson(time);
      return new Date(year, month + dM);
    });
  }, []);

  const daysInMonthForWFO = useMemo(() => {
    return getWFOInMonth(calendar, year, month);
  }, [calendar, year, month]);

  const daysFinishedInMonthForWFO = useMemo(() => {
    return active[activeKey]?.length || 0;
  }, [active, activeKey]);

  useEffect(() => {
    try {
      active &&
        typeof active === "object" &&
        sessionStorage.setItem(
          CALENDAR_TYPE.storageKey,
          JSON.stringify(active)
        );
    } catch (err) {
      console.log(err);
    }
  }, [active]);

  return (
    <>
      <div className="rounded-2xl bg-white p-7 ">
        <h1 className="flex font-black text-2xl pb-3 items-center">
          {header}
          <button
            className="w-12 h-12 ml-auto flex items-center justify-center"
            onClick={() => {
              changeMonth(-1);
            }}
          >
            <img src={LeftSVG} alt="left" className="w-3.5" />
          </button>
          <button
            className="w-12 h-12 flex items-center justify-center"
            onClick={() => changeMonth(1)}
          >
            <img src={RightSVG} alt="right" className="w-3.5" />
          </button>
        </h1>
        <dl className="calendar ">
          {CALENDAR_TYPE.weekTemplate.map((title) => {
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
                  active[activeKey]?.includes(date)
                    ? "active"
                    : date === CALENDAR_TYPE.disabled
                    ? "disabled"
                    : "normal",
                  isToday(date) ? "today" : ""
                )}
              >
                <button
                  onClick={() => {
                    if (date === CALENDAR_TYPE.disabled) return;
                    const list = active[activeKey] || [];
                    setActive((act) => {
                      return {
                        ...act,
                        [activeKey]: list.includes(date)
                          ? list.filter((d) => d !== date)
                          : list.concat(date),
                      };
                    });
                  }}
                >
                  {date === CALENDAR_TYPE.disabled ? "" : date}
                  {eachWeek.includes(date) ? (
                    <img
                      src={ReactSVG}
                      className="absolute top-1 right-1 w-3/12 motion-safe:animate-spin-slow"
                    />
                  ) : null}
                  {isToday(date) ? (
                    <img
                      src={ViteSVG}
                      className="absolute bottom-1 right-1 w-3/12 motion-safe:animate-bounce"
                    />
                  ) : null}
                </button>
              </Cell>
            );
          })}
        </dl>
      </div>
      <ol className="mt-5 p-5 font-light text-zinc-600 text-sm ">
        <li className="mb-2 list-disc">
          <p>
            We have to WFO for{" "}
            <span className="font-black text-lg text-green-600">
              {daysInMonthForWFO}
            </span>{" "}
            days this month, and now we finished{" "}
            <span className="text-lg text-orange-600 font-black">
              {daysFinishedInMonthForWFO}
            </span>{" "}
            days
          </p>
        </li>
        <li className="mb-2 list-disc">
          <p>
            <img
              src={ReactSVG}
              className="w-5 inline mr-1 motion-safe:animate-spin-slow"
            />
            <span>
              means that <span className="font-black text-lg">minimum</span>{" "}
              days <span className="font-black text-lg">per week</span> when we
              have to WFO
            </span>
          </p>
        </li>
        <li className="mb-2 list-disc">
          <p>
            {/* <span className="w-5 h-5 inline-block mr-1 bg-wfo animate-ping" /> */}
            <span className="relative inline-flex h-5 w-5 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full  bg-wfo opacity-75"></span>
              <span className="relative inline-flex  h-5 w-5 bg-wfo"></span>
            </span>
            <span>means the date for WFO</span>
          </p>
        </li>
        <li className="mb-2 list-disc">
          <p>
            <img src={ViteSVG} className="w-5 inline mr-1" />
            <span>means today</span>
          </p>
        </li>
      </ol>
    </>
  );
};
export default Calendar;
