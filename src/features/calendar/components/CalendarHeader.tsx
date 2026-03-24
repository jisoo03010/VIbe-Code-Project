import type { ViewType } from '../types/calendar.types';
import { GrowthPlant } from './GrowthPlant';

interface CalendarHeaderProps {
  currentDate: Date;
  viewType: ViewType;
  calendarDays: { date: Date }[];
  onViewChange: (view: ViewType) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  monthlyDoneCount?: number;
}

export function CalendarHeader({
  currentDate,
  viewType,
  calendarDays,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  monthlyDoneCount = 0,
}: CalendarHeaderProps) {
  const month = `${currentDate.getMonth() + 1}월`;
  const year = `${currentDate.getFullYear()}`;
  const weekRange =
    viewType === 'week' && calendarDays.length === 7
      ? `${calendarDays[0].date.getMonth() + 1}월 ${calendarDays[0].date.getDate()}일 - ${calendarDays[6].date.getMonth() + 1}월 ${calendarDays[6].date.getDate()}일`
      : '';

  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__left">
          <div className="header__date-row">
            <button className="nav-btn" onClick={onPrev}>‹</button>
            {viewType === 'month' ? (
              <>
                <span className="header__month">{month}</span>
                <span className="header__year">{year}</span>
              </>
            ) : (
              <span className="header__week-range">{weekRange}</span>
            )}
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
        <GrowthPlant doneCount={monthlyDoneCount} />
      </div>
    </header>
  );
}
