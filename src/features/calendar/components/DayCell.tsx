import type { CalendarDay } from '../types/calendar.types';

interface DayCellProps {
  day: CalendarDay;
  isToday: boolean;
  isSelected: boolean;
  todoCount: number;
  doneCount?: number;
  completionRate?: number;
  onClick: (date: Date) => void;
  shake?: boolean;
}

function getBeanColor(rate: number): string {
  if (rate <= 0) return '#e2e0de';
  if (rate >= 1) return '#96ce46';
  // 연한 연두 → 메인 컬러로 보간
  const lightness = 85 - rate * 31; // 85% → 54%
  const saturation = 30 + rate * 30; // 30% → 60%
  return `hsl(87, ${saturation}%, ${lightness}%)`;
}

type TodoState = 'none' | 'all-pending' | 'partial' | 'all-done';

function getTodoState(todoCount: number, doneCount: number): TodoState {
  if (todoCount === 0) return 'none';
  if (doneCount >= todoCount) return 'all-done';
  if (doneCount === 0) return 'all-pending';
  return 'partial';
}

export function DayCell({ day, isToday, isSelected, todoCount, doneCount = 0, completionRate = 0, onClick, shake }: DayCellProps) {
  const dow = day.date.getDay();
  const state = getTodoState(todoCount, doneCount);
  const beanCls = [
    'bean',
    isSelected && 'bean--selected',
    !day.isCurrentMonth && 'bean--muted',
    state === 'all-pending' && day.isCurrentMonth && 'bean--pending',
    state === 'partial' && day.isCurrentMonth && 'bean--partial',
    state === 'all-done' && day.isCurrentMonth && 'bean--done',
  ]
    .filter(Boolean)
    .join(' ');

  const numCls = [
    'day-num',
    isToday && 'day-num--today',
    !day.isCurrentMonth && 'day-num--muted',
    dow === 0 && day.isCurrentMonth && 'day-num--sun',
    dow === 6 && day.isCurrentMonth && 'day-num--sat',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`calendar-day${shake ? ' calendar-day--shake' : ''}`} onClick={() => onClick(day.date)}>
      <div
        className={beanCls}
        style={!day.isCurrentMonth ? undefined : { background: getBeanColor(completionRate) }}
      >
        {state === 'all-done' && <span className="bean__check">✓</span>}
        {state === 'partial' && <span className="bean__count">{todoCount - doneCount}</span>}
        {state === 'all-pending' && <span className="bean__count">{todoCount}</span>}
      </div>
      <span className={numCls}>{day.date.getDate()}</span>
    </div>
  );
}
