import React, { useState } from 'react';
import Link from 'next/link';
import { css } from '@emotion/react';
import { shortDateWithWeekday } from '../config/utils';

const calendarStyle = css`
  width: 400px;
  margin: 0 auto;

  .calendar-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1em;
    position: relative;
    
    .month-selector {
      position: relative;
      cursor: pointer;
      
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
  }

  .calendar-navigation {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1em;
    
    button {
      padding: 0.5em 1em;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2em;
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
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

const CalendarNavigator = ({ dates }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Get available months from dates, including 2024
  const availableMonths = [...new Set(dates.map(date => {
      const d = new Date(date.date);
      return `${d.getFullYear()}-${d.getMonth()}`;
  }))].sort((a, b) => {
      const [yearA, monthA] = a.split('-').map(Number);
      const [yearB, monthB] = b.split('-').map(Number);
      if (yearA !== yearB) return yearA - yearB;
      return monthA - monthB;
  });

  // Initialize with first available month
  const [currentYearMonth, setCurrentYearMonth] = useState(availableMonths[0]);
  const [year, month] = currentYearMonth.split('-').map(Number);

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