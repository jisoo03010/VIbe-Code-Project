import type { CalendarDay } from '../types/calendar.types';

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

interface WeekViewProps {
  calendarDays: CalendarDay[];
  selectedDate: Date | null;
  isToday: (date: Date) => boolean;
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

export function WeekView({ calendarDays, selectedDate, isToday, onDayClick, shakeToday }: WeekViewProps) {
  return (
    <div className="week-view">
      <div className="week-grid">
        {calendarDays.map((day, idx) => {
          const cls = [
            'week-day',
            isToday(day.date) && 'today',
            shakeToday && isToday(day.date) && 'calendar-day--shake',
            selectedDate && isSameDay(selectedDate, day.date) && 'selected',
            idx === 0 && 'sunday',
            idx === 6 && 'saturday',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <div key={idx} className={cls} onClick={() => onDayClick(day.date)}>
              <div className="week-day-name">{WEEK_DAYS[idx]}</div>
              <div className="week-day-date">{day.date.getDate()}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
