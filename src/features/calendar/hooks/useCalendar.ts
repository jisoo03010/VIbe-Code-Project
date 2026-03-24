import { useState } from 'react';
import type { CalendarDay, ViewType } from '../types/calendar.types';

function getDaysInMonth(date: Date): CalendarDay[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDayOfPrevMonth = new Date(year, month, 0).getDate();
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();

  const days: CalendarDay[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ date: new Date(year, month - 1, lastDayOfPrevMonth - i), isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInCurrentMonth; i++) {
    days.push({ date: new Date(year, month, i), isCurrentMonth: true });
  }
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
  }

  return days;
}

function getWeekDays(date: Date): CalendarDay[] {
  const current = new Date(date);
  const diff = current.getDate() - current.getDay();
  const firstDay = new Date(current.setDate(diff));

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(firstDay);
    day.setDate(firstDay.getDate() + i);
    return { date: new Date(day), isCurrentMonth: true };
  });
}

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>('month');

  const calendarDays =
    viewType === 'month' ? getDaysInMonth(currentDate) : getWeekDays(currentDate);

  const goToPrev = () => {
    if (viewType === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    }
  };

  const goToNext = () => {
    if (viewType === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    }
  };

  const goToToday = () => setCurrentDate(new Date());

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return { currentDate, viewType, setViewType, calendarDays, goToPrev, goToNext, goToToday, isToday };
}
