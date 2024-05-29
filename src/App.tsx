import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { WeekEnum } from "./enums";
import { DateRange } from "./types";
import { dateFormat } from "./utils/dateFormat";

const row = 5,
  col = 7;

function App() {
  const [allCalrendar, setAllCalrendar] = useState<Date[]>();
  const [currentMonth, setCurrentMonth] = useState<Date>();
  const [dateRange, setDateRange] = useState<DateRange>({});

  useEffect(() => {
    //初始化
    setCurrentMonth(new Date());
  }, []);

  useEffect(() => {
    handleAllCalrendar();
  }, [currentMonth]);

  const handleFirstCalendarDay = () => {
    if (currentMonth) {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();

      return new Date(year, month, 1 - new Date(year, month, 1).getDay());
    }
  };

  const handleAllCalrendar = () => {
    const firstCalendarDay = handleFirstCalendarDay();

    if (firstCalendarDay) {
      const year = firstCalendarDay.getFullYear();
      const month = firstCalendarDay.getMonth();
      const date = firstCalendarDay.getDate();

      const currentCalrendar = Array.from({ length: row * col }).map(
        (_, i) => new Date(year, month, date + i)
      );

      setAllCalrendar(currentCalrendar);
    }
  };

  const handleGetToday = (index: number) => {
    if (allCalrendar) {
      const year = allCalrendar[index].getFullYear();
      const month = allCalrendar[index].getMonth();
      const date = allCalrendar[index].getDate();

      const y = new Date().getFullYear();
      const m = new Date().getMonth();
      const d = new Date().getDate();

      return year === y && month === m && date === d;
    }
    return false;
  };

  const handleNonCurrentMonth = (index: number) => {
    if (currentMonth && allCalrendar) {
      const year = allCalrendar[index].getFullYear();
      const month = allCalrendar[index].getMonth();

      const y = currentMonth.getFullYear();
      const m = currentMonth.getMonth();

      const prevY = m < 1 ? y - 1 : y;
      const nextY = m > 10 ? y + 1 : y;
      const prevM = m < 1 ? 11 : m - 1;
      const nextM = m > 10 ? 0 : m + 1;

      return (
        (year === prevY || year === nextY) &&
        (month === prevM || month === nextM)
      );
    }
    return false;
  };

  const handleAdjectMonth = (step: number) => {
    if (currentMonth) {
      setCurrentMonth((prev) => {
        if (prev) {
          return new Date(
            prev.getFullYear(),
            prev.getMonth() + step,
            prev.getDate()
          );
        }
      });
    }
  };

  const handleSelected = (index: number) => {
    if (allCalrendar) {
      setDateRange((prev) => {
        if (prev.startDate) {
          if (allCalrendar[index] < prev.startDate) {
            return { ...prev, startDate: allCalrendar[index] };
          }
          return { ...prev, endDate: allCalrendar[index] };
        }
        return { startDate: allCalrendar[index] };
      });
    }
  };

  const handleActive = (index: number) => {
    if (allCalrendar && dateRange.startDate) {
      if (dateRange.endDate) {
        return (
          allCalrendar[index] >= dateRange.startDate &&
          allCalrendar[index] <= dateRange.endDate
        );
      }
      return allCalrendar[index] === dateRange.startDate;
    }
  };

  return (
    <div className="container">
      <div className="header">
        <button onClick={() => handleAdjectMonth(-1)}>{"<"}</button>
        <div>{dateFormat(currentMonth)}</div>
        <button onClick={() => handleAdjectMonth(1)}>{">"}</button>
      </div>

      <div className="calendar">
        <div className="weekDay">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i}>{WeekEnum[i]}</div>
          ))}
        </div>

        {Array.from({ length: row }).map((_, i) => (
          <div key={i} className="week">
            {Array.from({ length: col }).map((_, j) => (
              <div
                key={j}
                className={`
                  day
                  ${handleGetToday(i * 7 + j) && "today"}
                  ${handleNonCurrentMonth(i * 7 + j) && "non-cur-mon"}
                  ${handleActive(i * 7 + j) && "active"}
                  `}
                onClick={() => handleSelected(i * 7 + j)}
              >
                {`${allCalrendar?.[i * 7 + j].getDate()}日`}
                <i className="gg-block icon"></i>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
