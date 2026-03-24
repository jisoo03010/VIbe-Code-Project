import type { ViewType } from '../types/calendar.types';

interface CalendarHeaderProps {
  currentDate: Date;
  viewType: ViewType;
  calendarDays: { date: Date }[];
  onViewChange: (view: ViewType) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function CalendarHeader({
  currentDate,
  viewType,
  calendarDays,
  onViewChange,
  onPrev,
  onNext,
  onToday,
}: CalendarHeaderProps) {
  const monthYear = currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
  const weekRange =
    viewType === 'week' && calendarDays.length === 7
      ? `${calendarDays[0].date.getMonth() + 1}월 ${calendarDays[0].date.getDate()}일 - ${calendarDays[6].date.getMonth() + 1}월 ${calendarDays[6].date.getDate()}일`
      : '';

  return (
    <header className="header">
      <h1>🫘 Keep-It</h1>
      <div className="navigation">
        <div>
          <button className="nav-btn" onClick={onPrev}>‹</button>
          <h2 className="current-date">{viewType === 'month' ? monthYear : weekRange}</h2>
          <button className="nav-btn" onClick={onNext}>›</button>
        </div>
        <div className="header-controls">
          <button
            className={`view-btn ${viewType === 'month' ? 'active' : ''}`}
            onClick={() => onViewChange('month')}
          >
            월
          </button>
          <button
            className={`view-btn ${viewType === 'week' ? 'active' : ''}`}
            onClick={() => onViewChange('week')}
          >
            주
          </button>
          <button className="today-btn" onClick={onToday}>
            오늘
          </button>
        </div>
      </div>
    </header>
  );
}
