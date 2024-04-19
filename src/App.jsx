import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { showTime, getWFOfMonth, getWFOfWeek } from "./store/counter";
// import { useEffect } from "react";
// const  = useCounter();

const now = Date.now();
function App() {
  const [count, setCount] = useState(() => {
    let t = +localStorage.getItem("wfo-time");
    if (!t) return 0;
    t = new Date(t);
    const n = new Date();
    if (t.getFullYear() + t.getMonth() !== n.getFullYear() + n.getMonth()) {
      return 0;
    }
    if (!t || new Date(t).getFullYear())
      return +localStorage.getItem("wfo") || 0;
  });
  // const { showTime, dayOfWeek, dayOfMonth } = useCounter();
  const add = () => setCount((c) => c + 1);

  // useEffect(() => {
  //   typeof count === "number" && localStorage.setItem("wfo", count);
  //   localStorage.setItem("wfo-time", Date.now());
  // }, [count]);

  return (
    <>
      <h1>{getWFOfWeek(now)} days WFO this week</h1>
      <h2>{getWFOfMonth(now)} days WFO this Month</h2>
      <h3>{showTime()}</h3>
      <div>
        <a href="#" onClick={add}>
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="#" onClick={add}>
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div className="card">
        WFO{" "}
        <button onClick={() => setCount((count) => count - 1)}>{count}</button>{" "}
        days
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to finish WFO
      </p>
    </>
  );
}

export default App;
