import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { css } from '@emotion/react';
import { shortDateWithWeekday } from '../config/utils';

const calendarStyle = css`
  width: 400px;
  margin: 0 auto;

  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1em;
    
    .month-selector {
      position: relative;
      cursor: pointer;
      flex: 1;
      display: flex;
      justify-content: center;
      
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
          text-align: left;
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
      
      a {
        text-decoration: none;
        font-weight: 500;
        
        &:hover {
          text-decoration: underline;
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

    return {
      day: dayNumber,
      key: matchingDate?.key,
      isActive: !!matchingDate
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

  return (
    <div css={calendarStyle}>
      <div className="calendar-header">
        <button
          className="navigation-button"
          onClick={goToPreviousMonth}
          disabled={isFirstMonth}
          title="Previous Month"
        >
          ◀
        </button>
        
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
        
        <button
          className="navigation-button"
          onClick={goToNextMonth}
          disabled={isLastMonth}
          title="Next Month"
        >
          ▶
        </button>
      </div>

      <div css={gridStyle}>
        {weekdays.map(day => (
          <div key={day} className="weekday-header">
            {day}
          </div>
        ))}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${day?.isActive ? 'active' : 'inactive'}`}
          >
            {day && (
              day.isActive ? (
                <Link href={`/calendar/${day.key}`}>
                  {day.day}
                </Link>
              ) : (
                day.day
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarNavigator;