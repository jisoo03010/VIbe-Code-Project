import type { Todo } from '../types/todo.types';

interface TodoItemProps {
  todo: Todo;
  onStatusToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

const STATUS_LABEL: Record<Todo['status'], string> = {
  pending: '예정',
  'in-progress': '진행 중',
  done: '완료',
};

export function TodoItem({ todo, onStatusToggle, onDelete, onEdit }: TodoItemProps) {
  return (
    <div className={`todo-item todo-item--${todo.status}`}>
      <button className="todo-check" onClick={() => onStatusToggle(todo.id)}>
        {todo.status === 'done' ? '✓' : '○'}
      </button>

      <div className="todo-info" onClick={() => onEdit(todo)}>
        <span className="todo-content">{todo.content}</span>
        <div className="todo-meta">
          <span className="todo-category">{todo.category}</span>
          {todo.targetTime && (
            <span className="todo-time">{todo.targetTime}분</span>
          )}
          <span className="todo-status">{STATUS_LABEL[todo.status]}</span>
        </div>
      </div>

      <button className="todo-delete" onClick={() => onDelete(todo.id)}>✕</button>
    </div>
  );
}
