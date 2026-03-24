import type { Todo } from '../types/todo.types';
import { TodoList } from './TodoList';

interface TodoModalProps {
  date: Date | null;
  todos: Todo[];
  onAdd: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

function toDateStr(date: Date) {
  return date.toISOString().split('T')[0];
}

function formatTitle(date: Date) {
  return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
}

export function TodoModal({ date, todos, onAdd, onUpdate, onDelete, onClose }: TodoModalProps) {
  if (!date) return null;

  const dateStr = toDateStr(date);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3>{formatTitle(date)}</h3>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__body">
          <TodoList
            date={dateStr}
            todos={todos}
            onAdd={onAdd}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
}
