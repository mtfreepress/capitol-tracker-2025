import React, { useState } from 'react';
import Link from 'next/link';
import { css } from '@emotion/react';
import { shortDateWithWeekday } from '../config/utils';

const calendarStyle = css`
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.5em;
    text-align: center;
  }

  .weekday-header {
    font-weight: bold;
    padding: 0.5em;
  }

  .calendar-day {
    padding: 0.5em;
    border-radius: 4px;

    &.active {
      a {
        color: var(--link-color);
        text-decoration: none;
        
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
    // Get available months from dates
    const availableMonths = [...new Set(dates.map(date => {
        const d = new Date(date.date);
        return `${d.getFullYear()}-${d.getMonth()}`;
    }))].sort();

    // Initialize with first available month
    const [currentYearMonth, setCurrentYearMonth] = useState(availableMonths[0]);
    const [year, month] = currentYearMonth.split('-').map(Number);

    // Generate calendar data
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Create calendar grid
    const calendarDays = Array(35).fill(null).map((_, index) => {
        const dayNumber = index - firstDayOfMonth + 1;
        if (dayNumber < 1 || dayNumber > daysInMonth) return null;

        const dateStr = `${month + 1}/${dayNumber}/${year}`;
        const matchingDate = dates.find(d => d.date === dateStr);

        return {
            day: dayNumber,
            key: matchingDate?.key,
            isActive: !!matchingDate
        };
    });

    // Navigation handlers
    const currentMonthIndex = availableMonths.indexOf(currentYearMonth);
    const canGoBack = currentMonthIndex > 0;
    const canGoForward = currentMonthIndex < availableMonths.length - 1;

    const navigate = (direction) => {
        const newIndex = currentMonthIndex + direction;
        if (newIndex >= 0 && newIndex < availableMonths.length) {
            setCurrentYearMonth(availableMonths[newIndex]);
        }
    };

    return (
        <div css={calendarStyle}>
            <div className="calendar-header">
                <button 
                    onClick={() => navigate(-1)}
                    disabled={!canGoBack}
                >
                    &lt;
                </button>
                <h3>{new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                <button 
                    onClick={() => navigate(1)}
                    disabled={!canGoForward}
                >
                    &gt;
                </button>
            </div>
            <div className="calendar-grid">
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