import { useState } from 'react';
import { CalendarHeader, MonthView, WeekView, useCalendar } from './features/calendar';
import { useTodo } from './features/todo';
import { TodayPage } from './features/today/TodayPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { BottomNav } from './shared/components/BottomNav';
import { BottomSheet } from './shared/components/BottomSheet';
import './App.css';

type Page = 'home' | 'today' | 'settings';

const categoryAccent: Record<string, string> = {
  공부: '#96ce46',
  운동: '#ffa726',
  업무: '#42a5f5',
  개인: '#ef5350',
  기타: '#ab47bc',
};

export default function App() {
  const { currentDate, viewType, setViewType, calendarDays, goToPrev, goToNext, goToToday, isToday } =
    useCalendar();
  const { todos, getTodosForDate, updateTodo, getCompletionRate, getMonthlyDoneCount } = useTodo();

  const [page, setPage] = useState<Page>('home');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [shakeToday, setShakeToday] = useState(false);

  const handleToday = () => {
    goToToday();
    setShakeToday(true);
    setTimeout(() => setShakeToday(false), 600);
  };

  const getTodoCount = (dateStr: string) => getTodosForDate(dateStr).length;
  const getDoneCount = (dateStr: string) => getTodosForDate(dateStr).filter(t => t.status === 'done').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTodos = getTodosForDate(todayStr);

  const handleToggle = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    updateTodo(id, { status: todo.status === 'done' ? 'pending' : 'done' });
  };

  return (
    <div className="app">
      <div className="page-wrapper">
        <div className={`page ${page === 'home' ? 'page--active' : ''}`}>
          <CalendarHeader
            currentDate={currentDate}
            viewType={viewType}
            calendarDays={calendarDays}
            onViewChange={setViewType}
            onPrev={goToPrev}
            onNext={goToNext}
            onToday={handleToday}
            monthlyDoneCount={getMonthlyDoneCount(todayStr.slice(0, 7))}
          />
          <div className="calendar-container">
            {viewType === 'month' ? (
              <MonthView
                calendarDays={calendarDays}
                selectedDate={selectedDate}
                isToday={isToday}
                getTodoCount={getTodoCount}
                getDoneCount={getDoneCount}
                getCompletionRate={getCompletionRate}
                onDayClick={setSelectedDate}
                shakeToday={shakeToday}
              />
            ) : (
              <WeekView
                calendarDays={calendarDays}
                selectedDate={selectedDate}
                isToday={isToday}
                onDayClick={setSelectedDate}
                shakeToday={shakeToday}
              />
            )}
          </div>
          {selectedDate && (() => {
            const dateStr = selectedDate.toISOString().split('T')[0];
            const dateTodos = getTodosForDate(dateStr);
            return (
              <BottomSheet key={dateStr} onClose={() => setSelectedDate(null)}>
                <div className="day-todo-panel">
                  <div className="day-todo-panel__header">
                    {selectedDate.toLocaleDateString('ko-KR', {
                      month: 'long',
                      day: 'numeric',
                      weekday: 'long',
                    })}
                  </div>
                  {dateTodos.length === 0 ? (
                    <p className="day-todo-panel__empty">등록된 할 일이 없습니다</p>
                  ) : (
                    <ul className="day-todo-list">
                      {dateTodos.map((todo, idx) => (
                        <li
                          key={todo.id}
                          className={`day-todo-item ${todo.status === 'done' ? 'day-todo-item--done' : ''}`}
                          style={{ animationDelay: `${idx * 60}ms` }}
                          onClick={() => handleToggle(todo.id)}
                        >
                          <span
                            className="day-todo-item__dot"
                            style={{ background: categoryAccent[todo.category] ?? '#96ce46' }}
                          />
                          <div className="day-todo-item__body">
                            <span className="day-todo-item__content">{todo.content}</span>
                            <span className="day-todo-item__meta">
                              {todo.category}{todo.targetTime ? ` · ${todo.targetTime}분` : ''}
                            </span>
                          </div>
                          <span className="day-todo-item__status">
                            {todo.status === 'done' ? '✓' : ''}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </BottomSheet>
            );
          })()}
        </div>

        <div className={`page ${page === 'today' ? 'page--active' : ''}`}>
          <TodayPage todos={todayTodos} onToggle={handleToggle} />
        </div>

        <div className={`page ${page === 'settings' ? 'page--active' : ''}`}>
          <SettingsPage />
        </div>
      </div>

      <BottomNav current={page} onChange={setPage} />
    </div>
  );
}
