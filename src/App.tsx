import { useState, useCallback } from 'react';
import { CalendarHeader, MonthView, WeekView, useCalendar } from './features/calendar';
import { useTodo } from './features/todo';
import type { Todo } from './features/todo';
import { TodayPage } from './features/today/TodayPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { useCategory } from './features/settings/useCategory';
import { usePattern } from './features/settings/usePattern';
import { useAuth } from './features/auth/useAuth';
import { AuthPage } from './features/auth/AuthPage';
import { BottomNav } from './shared/components/BottomNav';
import { BottomSheet } from './shared/components/BottomSheet';
import { DayTodoPanel } from './features/todo/components/DayTodoPanel';
import { Snackbar } from './shared/components/Snackbar';
import './App.css';

type Page = 'home' | 'today' | 'settings';

export default function App() {
  const { user, loading, signIn, signUp } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading">
        <span className="auth-logo__bean">🫘</span>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onSignIn={signIn} onSignUp={signUp} />;
  }

  return <AppMain />;
}

function AppMain() {
  const { signOut } = useAuth();
  const { currentDate, viewType, setViewType, calendarDays, goToPrev, goToNext, goToToday, isToday } =
    useCalendar();
  const { todos, addTodo, deleteTodo, getTodosForDate, updateTodo, getCompletionRate, getMonthlyDoneCount } = useTodo();
  const { categories, maxCategories, addCategory, updateCategory, deleteCategory } = useCategory();
  const { patterns, addPattern, updatePattern, deletePattern } = usePattern();

  const taskCounts: Record<string, number> = {};
  for (const t of todos) {
    taskCounts[t.category] = (taskCounts[t.category] ?? 0) + 1;
  }

  const categoryAccentMap: Record<string, string> = {};
  for (const c of categories) {
    categoryAccentMap[c.name] = c.color;
  }

  const [page, setPage] = useState<Page>('home');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [shakeToday, setShakeToday] = useState(false);
  const [deletedTodo, setDeletedTodo] = useState<Todo | null>(null);

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

  const handleDelete = useCallback((id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    setDeletedTodo(todo);
    deleteTodo(id);
  }, [todos, deleteTodo]);

  const handleUndo = useCallback(() => {
    if (!deletedTodo) return;
    addTodo({
      content: deletedTodo.content,
      category: deletedTodo.category,
      targetTime: deletedTodo.targetTime,
      status: deletedTodo.status,
      date: deletedTodo.date,
    });
    setDeletedTodo(null);
  }, [deletedTodo, addTodo]);

  const handleDismissSnackbar = useCallback(() => {
    setDeletedTodo(null);
  }, []);

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
          <DayTodoPanel
            date={new Date()}
            todos={todayTodos}
            categories={categories}
            categoryAccentMap={categoryAccentMap}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onAdd={addTodo}
          />
          {selectedDate && (() => {
            const dateStr = selectedDate.toISOString().split('T')[0];
            const dateTodos = getTodosForDate(dateStr);
            return (
              <BottomSheet key={dateStr} onClose={() => setSelectedDate(null)}>
                <DayTodoPanel
                  date={selectedDate}
                  todos={dateTodos}
                  categories={categories}
                  categoryAccentMap={categoryAccentMap}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onAdd={addTodo}
                />
              </BottomSheet>
            );
          })()}
        </div>

        <div className={`page ${page === 'today' ? 'page--active' : ''}`}>
          <TodayPage todos={todos} />
        </div>

        <div className={`page ${page === 'settings' ? 'page--active' : ''}`}>
          <SettingsPage
            categories={categories}
            maxCategories={maxCategories}
            taskCounts={taskCounts}
            onAddCategory={addCategory}
            onUpdateCategory={updateCategory}
            onDeleteCategory={deleteCategory}
            patterns={patterns}
            onAddPattern={addPattern}
            onUpdatePattern={updatePattern}
            onDeletePattern={deletePattern}
            onSignOut={signOut}
          />
        </div>
      </div>

      <BottomNav current={page} onChange={setPage} />

      {deletedTodo && (
        <Snackbar
          key={deletedTodo.id}
          message={`"${deletedTodo.content}" 삭제됨`}
          onUndo={handleUndo}
          onDismiss={handleDismissSnackbar}
        />
      )}
    </div>
  );
}
