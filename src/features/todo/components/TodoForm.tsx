import { useState } from 'react';
import type { Category, Todo, TodoStatus } from '../types/todo.types';

const CATEGORIES: Category[] = ['공부', '운동', '업무', '개인', '기타'];

interface TodoFormProps {
  date: string; // YYYY-MM-DD
  initialValues?: Partial<Todo>;
  onSubmit: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function TodoForm({ date, initialValues, onSubmit, onCancel }: TodoFormProps) {
  const [content, setContent] = useState(initialValues?.content ?? '');
  const [category, setCategory] = useState<Category>(initialValues?.category ?? '기타');
  const [targetTime, setTargetTime] = useState(initialValues?.targetTime?.toString() ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSubmit({
      content: content.trim(),
      category,
      targetTime: targetTime ? Number(targetTime) : undefined,
      status: (initialValues?.status ?? 'pending') as TodoStatus,
      date,
    });
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        className="todo-form__input"
        type="text"
        placeholder="할 일을 입력하세요"
        value={content}
        onChange={e => setContent(e.target.value)}
        autoFocus
      />

      <div className="todo-form__row">
        <select
          className="todo-form__select"
          value={category}
          onChange={e => setCategory(e.target.value as Category)}
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          className="todo-form__time"
          type="number"
          placeholder="목표 시간(분)"
          min={1}
          value={targetTime}
          onChange={e => setTargetTime(e.target.value)}
        />
      </div>

      <div className="todo-form__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>취소</button>
        <button type="submit" className="btn btn--primary">저장</button>
      </div>
    </form>
  );
}
