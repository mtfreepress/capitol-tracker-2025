import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { css } from '@emotion/react';
import { shortDateWithWeekday } from '../config/utils';

const calendarStyle = css`
  width: 100%;
  max-width: 420px;
  margin: 0 auto;

  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: .25em;
    
    .month-selector {
      position: relative;
      cursor: pointer;
      flex: 1;
      display: flex;
      justify-content: center;
      font-size: 1.2em;
      
      h3 {
        display: flex;
        align-items: center;
        margin: 0;
        padding: 0.5em 1em;
        
        &:after {
          content: '▾';
          margin-left: 0.5em;
          transition: transform 0.2s ease;
        }
        
        &.open:after {
          transform: rotate(180deg);
        }
      }
      
      .month-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 10;
        
        button {
          width: 100%;
          text-align: center;
          padding: 0.75em 1em;
          border: none;
          background: none;
          cursor: pointer;
          
          &:hover {
            background: var(--gray1);
          }
        }
      }
    }
    
    .navigation-button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2em;
      padding: 0.5em;
      transition: color 0.2s ease;
      
      &:hover {
        color: #ce5a00;
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        visibility: hidden;
      }
    }
  }

  .weekday-header {
    font-weight: bold;
    padding: 0.5em;
    border-bottom: 1px solid var(--gray2);
  }

 .calendar-day {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25em;
    border-radius: 4px;
    border: 1px solid transparent;

    &.active {
      border-color: var(--gray2);
      padding: 0;
      
      a {
        text-decoration: none;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 3px; 
        transition: all 0.2s ease;
        
        &:hover {
          background-color: var(--tan2);
          color: var(--link);
        }
        
        &.current {
          background-color: #ce5a00;
          color: white;
          font-weight: bold;
          font-size: 1.1em;
          
          &:hover {
            background-color: darken(#ce5a00, 10%);
            color: white;
          }
        }
      }
    }

    &.inactive {
      color: var(--gray3);
    }
  }
`;


const CalendarNavigator = ({ dates, currentPageDate }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isTodayPage = () => {
    if (currentPageDate === null) {
      return true;
    }
    const today = new Date();
    const todayKey = formatDateKey(today);
    return currentPageDate === todayKey;
  };

  // Get available months from dates
  const availableMonths = [...new Set(dates.map(date => {
    const d = new Date(date.date);
    return `${d.getFullYear()}-${d.getMonth()}`;
  }))].sort((a, b) => {
    const [yearA, monthA] = a.split('-').map(Number);
    const [yearB, monthB] = b.split('-').map(Number);
    if (yearA !== yearB) return yearA - yearB;
    return monthA - monthB;
  });

  const formatDateKey = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  const getValidNavigationDate = () => {
    if (currentPageDate) return currentPageDate;
    const today = new Date();
    return formatDateKey(today);
  };


  const getNavigationDays = (allDates, currentDate) => {
    if (!currentDate) return { prev: null, next: null };

    const activeDates = allDates.filter(d =>
      d.hearings.length > 0 || d.floorDebates.length > 0 || d.finalVotes.length > 0
    );

    if (activeDates.length === 0) return { prev: null, next: null };

    const sortedDates = [...activeDates].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });

    const currentIndex = sortedDates.findIndex(d => d.key === currentDate);

    if (currentIndex !== -1) {
      const prev = currentIndex > 0 ? sortedDates[currentIndex - 1].key : null;
      const next = currentIndex < sortedDates.length - 1 ? sortedDates[currentIndex + 1].key : null;
      return { prev, next };
    }
    else {
      const currentDateObj = new Date(currentDate.replace(/-/g, '/'));
      const prevDate = sortedDates.reduce((closest, current) => {
        const date = new Date(current.date);
        if (date < currentDateObj && (!closest || date > new Date(closest.date))) {
          return current;
        }
        return closest;
      }, null);
      const nextDate = sortedDates.find(d => new Date(d.date) > currentDateObj);

      return {
        prev: prevDate?.key || null,
        next: nextDate?.key || null
      };
    }
  };

  const getInitialMonth = () => {
    // If we have a current page date, use its month
    if (currentPageDate) {
      const pageDate = new Date(currentPageDate.replace(/-/g, '/'));
      const pageYearMonth = `${pageDate.getFullYear()}-${pageDate.getMonth()}`;

      if (availableMonths.includes(pageYearMonth)) {
        return pageYearMonth;
      }
    }

    // Otherwise, find current month or nearest available
    const now = new Date();
    const currentYM = `${now.getFullYear()}-${now.getMonth()}`;

    if (availableMonths.includes(currentYM)) {
      return currentYM;
    }

    // If neither is available, find closest month
    const currentTimestamp = now.getTime();
    let closestMonth = availableMonths[0];
    let smallestDiff = Infinity;

    availableMonths.forEach(monthStr => {
      const [y, m] = monthStr.split('-').map(Number);
      const monthDate = new Date(y, m, 1);
      const diff = Math.abs(monthDate.getTime() - currentTimestamp);

      if (diff < smallestDiff) {
        smallestDiff = diff;
        closestMonth = monthStr;
      }
    });

    return closestMonth;
  };

  // Initialize with page date's month if provided, otherwise closest month to current date
  const [currentYearMonth, setCurrentYearMonth] = useState(() => getInitialMonth());

  // Update when dates or currentPageDate changes
  useEffect(() => {
    setCurrentYearMonth(getInitialMonth());
  }, [dates, currentPageDate]);

  const [year, month] = currentYearMonth.split('-').map(Number);

  const goToPreviousMonth = () => {
    const currentIndex = availableMonths.indexOf(currentYearMonth);
    if (currentIndex > 0) {
      setCurrentYearMonth(availableMonths[currentIndex - 1]);
    }
  };

  const goToNextMonth = () => {
    const currentIndex = availableMonths.indexOf(currentYearMonth);
    if (currentIndex < availableMonths.length - 1) {
      setCurrentYearMonth(availableMonths[currentIndex + 1]);
    }
  };

  const isFirstMonth = availableMonths.indexOf(currentYearMonth) === 0;
  const isLastMonth = availableMonths.indexOf(currentYearMonth) === availableMonths.length - 1;

  // Calculate weeks needed
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const weeksNeeded = Math.ceil((firstDayOfMonth + daysInMonth) / 7);

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Create calendar grid with only needed weeks
  const calendarDays = Array(weeksNeeded * 7).fill(null).map((_, index) => {
    const dayNumber = index - firstDayOfMonth + 1;
    if (dayNumber < 1 || dayNumber > daysInMonth) return null;

    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(dayNumber).padStart(2, '0');
    const dateStr = `${monthStr}/${dayStr}/${year}`;
    const matchingDate = dates.find(d => d.date === dateStr);

    const hasLegislativeActions = matchingDate && (
      matchingDate.hearings.length > 0 ||
      matchingDate.floorDebates.length > 0 ||
      matchingDate.finalVotes.length > 0
    );

    return {
      day: dayNumber,
      key: matchingDate?.key,
      isActive: hasLegislativeActions
    };
  });

  // Format month display with correct month index
  const formatMonthYear = (yearMonth) => {
    const [y, m] = yearMonth.split('-').map(Number);
    return new Date(y, m).toLocaleString('default', {
      month: 'long',
      year: 'numeric'
    });
  };

  const gridStyle = css`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: auto repeat(${weeksNeeded}, 1fr);
    gap: 0.25em;
    text-align: center;
    border: 1px solid var(--gray2);
    padding: 0.5em;
    border-radius: 4px;
  `;

  const navigationDate = getValidNavigationDate();
  const { prev, next } = getNavigationDays(dates, navigationDate);

  return (
    <div css={calendarStyle}>
      <div className="calendar-header">
        <div className="month-selector">
          <h3
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={isDropdownOpen ? 'open' : ''}
          >
            {formatMonthYear(currentYearMonth)}
          </h3>
          {isDropdownOpen && (
            <div className="month-dropdown">
              {availableMonths.map(monthYear => (
                <button
                  key={monthYear}
                  onClick={() => {
                    setCurrentYearMonth(monthYear);
                    setIsDropdownOpen(false);
                  }}
                >
                  {formatMonthYear(monthYear)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0em;
          margin-bottom: 0.5em;
          gap: 0.5em;
          min-height: 50px;
        `}
      >
        {prev ? (
          <Link href={`/calendar/${prev}`} passHref>
            <button
              className="nav-day-button"
              title="Go to Previous Legislative Day"
              css={css`
                background: none !important;
                border: none !important;
                cursor: pointer;
                font-size: 1.2em;
                padding: 0.5em;
                transition: color 0.2s ease;
                outline: none !important;
                box-shadow: none !important;

                &:hover {
                  color: #ce5a00 !important;
                  background: none !important;
                  border: none !important;
                  outline: none !important;
                  box-shadow: none !important;
                }

                &:focus {
                  outline: none !important;
                  box-shadow: none !important;
                }

                &:disabled {
                  opacity: 0.5;
                  cursor: not-allowed;
                  visibility: hidden;
                }
              `}
            >
              ◀
            </button>
          </Link>
        ) : (
          <div css={css`min-width: 90px;`}></div>
        )}

        {/* Center section with conditional today button */}
        <div
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-width: 90px;
          `}
        >
          {!isTodayPage() && (
            <Link href="/calendar" passHref>
              <button
                className="today-button"
                title="Go to Today"
                css={css`
                  background-color: var(--tan2);
                  border: 1px solid transparent;
                  border-radius: 4px;
                  padding: 0.2em 0.6em;
                  font-size: 0.85em;
                  font-weight: 600;
                  cursor: pointer;
                  transition: all 0.2s ease;
                  box-sizing: border-box;

                  &:hover {
                    background-color: var(--tan3);
                    color: var(--link);
                    border: 1px solid transparent;
                  }
                `}
              >
                Back to today
              </button>
            </Link>
          )}
        </div>

        {next ? (
          <Link href={`/calendar/${next}`} passHref>
            <button
              className="nav-day-button"
              title="Go to Next Legislative Day"
              css={css`
                background: none !important;
                border: none !important;
                cursor: pointer;
                font-size: 1.2em;
                padding: 0.5em;
                transition: color 0.2s ease;
                outline: none !important;
                box-shadow: none !important;

                &:hover {
                  color: #ce5a00 !important;
                  background: none !important;
                  border: none !important;
                  outline: none !important;
                  box-shadow: none !important;
                }

                &:focus {
                  outline: none !important;
                  box-shadow: none !important;
                }

                &:disabled {
                  opacity: 0.5;
                  cursor: not-allowed;
                  visibility: hidden;
                }
              `}
            >
              ▶
            </button>
          </Link>
        ) : (
          <div css={css`min-width: 90px;`}></div>
        )}
      </div>

      <div css={gridStyle}>
        {weekdays.map(day => (
          <div key={day} className="weekday-header">
            {day}
          </div>
        ))}
        {calendarDays.map((day, index) => {
          // Check if this day is the currently selected day
          const isCurrentDay = day && day.key === currentPageDate;

          return (
            <div
              key={index}
              className={`calendar-day ${day?.isActive ? 'active' : 'inactive'}`}
            >
              {day && (
                day.isActive ? (
                  <Link
                    href={`/calendar/${day.key}`}
                    className={isCurrentDay ? 'current' : ''}
                  >
                    {day.day}
                  </Link>
                ) : (
                  day.day
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarNavigator;