import type { CalendarDay } from '../types/calendar.types';
import { DayCell } from './DayCell';

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

interface MonthViewProps {
  calendarDays: CalendarDay[];
  selectedDate: Date | null;
  isToday: (date: Date) => boolean;
  getTodoCount: (dateStr: string) => number;
  getDoneCount: (dateStr: string) => number;
  getCompletionRate: (dateStr: string) => number;
  onDayClick: (date: Date) => void;
  shakeToday?: boolean;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toDateStr(date: Date) {
  return date.toISOString().split('T')[0];
}

export function MonthView({ calendarDays, selectedDate, isToday, getTodoCount, getDoneCount, getCompletionRate, onDayClick, shakeToday }: MonthViewProps) {
  return (
    <div className="month-view">
      <div className="weekday-header">
        {WEEK_DAYS.map((day, idx) => (
          <div key={idx} className={`weekday ${idx === 0 ? 'sunday' : idx === 6 ? 'saturday' : ''}`}>
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {calendarDays.map((day, idx) => (
          <DayCell
            key={idx}
            day={day}
            isToday={isToday(day.date)}
            isSelected={!!selectedDate && isSameDay(selectedDate, day.date)}
            todoCount={getTodoCount(toDateStr(day.date))}
            doneCount={getDoneCount(toDateStr(day.date))}
            completionRate={getCompletionRate(toDateStr(day.date))}
            onClick={onDayClick}
            shake={shakeToday && isToday(day.date)}
          />
        ))}
      </div>
    </div>
  );
}
