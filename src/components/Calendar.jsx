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
  getLocation,
  calculateDistance,
  useLocationStore,
} from "../store/calendar";
import ReactSVG from "../assets/react.svg";
import ViteSVG from "/vite.svg";
import RightSVG from "../assets/chevron-right.svg";
import LeftSVG from "../assets/chevron-left.svg";
import { useEffect } from "react";
const Settings = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={cn("w-6 h-6", className)}
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
);

const Cell = ({ children, element, ...props }) => {
  return createElement(
    element,
    props,
    <div>
      <div>{children}</div>
    </div>
  );
};

const useStoreDate = (key) => {
  const [data, setData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) || {};
    } catch (err) {
      console.log(err);
      return {};
    }
  });
  useEffect(() => {
    try {
      data &&
        typeof data === "object" &&
        localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.log(err);
    }
  }, [data, key]);
  return [data, setData];
};

const Calendar = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [active, setActive] = useStoreDate(CALENDAR_TYPE.storageKey);
  const [holiday, setHoliday] = useStoreDate(CALENDAR_TYPE.storageHolidayKey);
  const {
    location,
    resetLocation,
    setLocation,
    setCurrentLocation,
    currentLocation,
  } = useLocationStore((state) => {
    return state;
  });
  const [time, setTime] = useState(() => new Date());
  const dataKey = useMemo(() => {
    return genKeyOfWFO(time);
  }, [time]);
  const [calendar, header, year, month] = useMemo(() => {
    const [list, year, month] = getMonthList(time);
    return [list, getMonthString(year, month), year, month];
  }, [time]);
  const eachWeek = useMemo(() => {
    return getEachWeekWFO(calendar, year, month, {
      holiday: holiday[dataKey],
    }).reduce((prev, cur) => cur.slice(1).concat(prev), []);
  }, [calendar, year, month, holiday, dataKey]);
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

  const changeMonth = useCallback((dM) => {
    setTime((time) => {
      const { year, month } = dateToJson(time);
      return new Date(year, month + dM);
    });
  }, []);

  const daysInMonthForWFO = useMemo(() => {
    return getWFOInMonth(calendar, year, month, { holiday: holiday[dataKey] });
  }, [calendar, year, month, holiday, dataKey]);

  const daysFinishedInMonthForWFO = useMemo(() => {
    return active[dataKey]?.length || 0;
  }, [active, dataKey]);

  useEffect(() => {
    const { year, month, date } = dateToJson(new Date());
    const key = genKeyOfWFO(new Date(year, month));
    const list = active[key] || [];
    const flag = list.includes(date);
    if (flag) return;
    getLocation().then((res) => {
      const { latitude, longitude } = res;
      const distance = calculateDistance(
        latitude,
        longitude,
        location.lat,
        location.lon
      );
      setCurrentLocation({ latitude, longitude });
      console.log(`distance: ${distance}`);
      if (distance <= location.dis) {
        setActive((act) => {
          return {
            ...act,
            [key]: list.concat(date),
          };
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        className={cn(
          "rounded-2xl bg-white p-7 shadow-sm",
          isEdit ? "opacity-50 bg-blend-darken" : ""
        )}
      >
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
                  active[dataKey]?.includes(date)
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
                    const current = isEdit ? holiday : active;
                    const setCurrent = isEdit ? setHoliday : setActive;
                    toggle(current, setCurrent);
                    function toggle(obj, setObj) {
                      const list = obj[dataKey] || [];
                      setObj((act) => {
                        return {
                          ...act,
                          [dataKey]: list.includes(date)
                            ? list.filter((d) => d !== date)
                            : list.concat(date),
                        };
                      });
                    }
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
                  {holiday[dataKey]?.includes(date) ? (
                    <div className="absolute bottom-1 holiday w-2 h-2  bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
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
            <img src={ReactSVG} className="w-5 inline mr-1 " />
            <span>
              means that <span className="font-black text-lg">minimum</span>{" "}
              days <span className="font-black text-lg">per week</span> when we
              have to WFO
            </span>
          </p>
        </li>
        <li className="mb-2 list-disc">
          <p>
            <span className="w-5 h-5 inline-block mr-1 bg-wfo " />
            <span>means the date for WFO</span>
          </p>
        </li>
        <li className="mb-2 list-disc">
          <p>
            <img src={ViteSVG} className="w-5 inline mr-1" />
            <span>means today</span>
          </p>
        </li>
        <li className="mb-2 list-disc">
          <p>
            <span className="w-5 h-5 rounded-full inline-block mr-1 bg-gradient-to-r from-purple-500 to-pink-500" />
            <span>means holiday</span>
          </p>
        </li>
        <li className="mb-2 list-disc">
          <p>
            <Settings
              className={cn(
                " inline mr-1 text-black ",
                isEdit ? "animate-spin" : ""
              )}
              onClick={() => setIsEdit((bool) => !bool)}
            />
            <span>
              Please click the settings button to manual the holiday or the
              location
            </span>
          </p>
        </li>
      </ol>
      {isEdit && (
        <form className="flex flex-col p-3" action="/" target="_self">
          <h2 className="text-center font-extrabold text-2xl">
            Location settings
          </h2>
          <label className="py-2" htmlFor="lat">
            Latitude:
          </label>
          <input
            className="p-2 caret-blue-500 focus:caret-indigo-500 rounded-md"
            type="number"
            id="lat"
            value={location.lat}
            onChange={setLocation}
            required
          />
          <label htmlFor="lon" className="py-2">
            Longitude:
          </label>
          <input
            className="p-2 rounded-md"
            type="number"
            id="lon"
            value={location.lon}
            onChange={setLocation}
            required
          />
          <label htmlFor="dis" className="py-2">
            Distance:
          </label>
          <input
            required
            className="p-2 rounded-md"
            type="number"
            id="dis"
            value={location.dis}
            onChange={setLocation}
          />
          <div className="flex mt-5 mb=5 ">
            <button
              className="basis-3/4 mr-3 w-64 bg-red-600 rounded-md text-white p-3.5"
              type="submit"
            >
              Submit
            </button>
            <button
              className="flex-1 bg-white rounded-md text-black border p-3.5"
              type="button"
              onClick={resetLocation}
            >
              Reset
            </button>
          </div>
          {JSON.stringify(currentLocation)}
          <button
            className="flex-1 bg-white rounded-md text-black border p-3.5"
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(currentLocation));
            }}
          >
            copy
          </button>
        </form>
      )}
    </>
  );
};
export default Calendar;
