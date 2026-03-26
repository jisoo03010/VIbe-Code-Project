import { useState, useRef, useEffect } from 'react';
import type { Todo, CategoryItem } from '../types/todo.types';
import { SwipeToDelete } from '../../../shared/components/SwipeToDelete';

interface DayTodoPanelProps {
  date: Date;
  todos: Todo[];
  categories: CategoryItem[];
  categoryAccentMap: Record<string, string>;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
}

export function DayTodoPanel({
  date,
  todos,
  categories,
  categoryAccentMap,
  onToggle,
  onDelete,
  onAdd,
}: DayTodoPanelProps) {
  const [addingCategory, setAddingCategory] = useState<string | null>(null);
  const [newContent, setNewContent] = useState('');
  const [newHours, setNewHours] = useState('');
  const [newMinutes, setNewMinutes] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const dateStr = date.toISOString().split('T')[0];
  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = dateStr === todayStr;
  const dateLabel = date.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
  const remaining = todos.filter(t => t.status !== 'done').length;

  const grouped = categories.map(cat => ({
    category: cat,
    items: todos.filter(t => t.category === cat.name),
  }));

  useEffect(() => {
    if (addingCategory && inputRef.current) {
      inputRef.current.focus();
    }
  }, [addingCategory]);

  const getTargetTime = () => {
    const h = Number(newHours) || 0;
    const m = Number(newMinutes) || 0;
    const total = h * 60 + m;
    return total > 0 ? total : undefined;
  };

  const formatTargetTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0 && m > 0) return `${h}시간 ${m}분`;
    if (h > 0) return `${h}시간`;
    return `${m}분`;
  };

  const handleSubmit = (categoryName: string) => {
    if (!newContent.trim()) return;
    onAdd({
      content: newContent.trim(),
      category: categoryName,
      targetTime: getTargetTime(),
      status: 'pending',
      date: dateStr,
    });
    setNewContent('');
    setNewHours('');
    setNewMinutes('');
    setAddingCategory(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, categoryName: string) => {
    if (e.key === 'Enter') {
      handleSubmit(categoryName);
    } else if (e.key === 'Escape') {
      setAddingCategory(null);
      setNewContent('');
      setNewHours('');
      setNewMinutes('');
    }
  };

  const resetForm = (categoryName: string) => {
    setAddingCategory(addingCategory === categoryName ? null : categoryName);
    setNewContent('');
    setNewHours('');
    setNewMinutes('');
  };

  return (
    <div className="day-todo-panel">
      <div className="day-todo-panel__header">
        <div className="day-todo-panel__title-row">
          <span className="day-todo-panel__date">{dateLabel}</span>
          {isToday && <span className="day-todo-panel__badge">오늘</span>}
        </div>
        {todos.length > 0 && (
          <span className="day-todo-panel__remaining">
            {remaining > 0 ? `${remaining}개 남음` : '모두 완료!'}
          </span>
        )}
      </div>

      {grouped.map((group, gi) => (
        <div
          key={group.category.id}
          className="cat-group"
          style={{ animationDelay: `${gi * 80}ms` }}
        >
          <div className="cat-group__header">
            <span className="cat-group__dot" style={{ background: group.category.color }} />
            <span className="cat-group__name">{group.category.name}</span>
            <span className="cat-group__count">{group.items.length}</span>
            <button
              className="cat-group__add-btn"
              onClick={() => resetForm(group.category.name)}
              aria-label="할 일 추가"
            >
              +
            </button>
          </div>

          {group.items.length > 0 && (
            <ul className="cat-group__list">
              {group.items.map((todo, idx) => (
                <li
                  key={todo.id}
                  style={{ animationDelay: `${gi * 80 + idx * 50}ms` }}
                  className="day-todo-item-wrapper"
                >
                  <SwipeToDelete onDelete={() => onDelete(todo.id)}>
                    <div
                      className={`day-todo-item${todo.status === 'done' ? ' day-todo-item--done' : ''}`}
                      onClick={() => onToggle(todo.id)}
                    >
                      <span
                        className="day-todo-item__dot"
                        style={{ background: categoryAccentMap[todo.category] ?? '#96ce46' }}
                      />
                      <div className="day-todo-item__body">
                        <span className="day-todo-item__content">{todo.content}</span>
                        {todo.targetTime && (
                          <span className="day-todo-item__meta">{formatTargetTime(todo.targetTime)}</span>
                        )}
                      </div>
                      <span className="day-todo-item__status">
                        {todo.status === 'done' ? '✓' : ''}
                      </span>
                    </div>
                  </SwipeToDelete>
                </li>
              ))}
            </ul>
          )}

          {addingCategory === group.category.name && (
            <div className="cat-group__form">
              <input
                ref={inputRef}
                className="cat-group__input"
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                onKeyDown={e => handleKeyDown(e, group.category.name)}
                placeholder="할 일 입력"
                maxLength={50}
              />
              <div className="cat-group__time">
                <input
                  className="cat-group__input cat-group__input--time"
                  type="number"
                  value={newHours}
                  onChange={e => setNewHours(e.target.value)}
                  onKeyDown={e => handleKeyDown(e, group.category.name)}
                  placeholder="시간"
                  min={0}
                  max={23}
                />
                <span className="cat-group__time-sep">:</span>
                <input
                  className="cat-group__input cat-group__input--time"
                  type="number"
                  value={newMinutes}
                  onChange={e => setNewMinutes(e.target.value)}
                  onKeyDown={e => handleKeyDown(e, group.category.name)}
                  placeholder="분"
                  min={0}
                  max={59}
                />
              </div>
              <button
                className="cat-group__submit"
                disabled={!newContent.trim()}
                onClick={() => handleSubmit(group.category.name)}
              >
                추가
              </button>
            </div>
          )}
        </div>
      ))}

      {categories.length === 0 && (
        <p className="day-todo-panel__empty">카테고리를 먼저 추가해 주세요</p>
      )}
    </div>
  );
}
