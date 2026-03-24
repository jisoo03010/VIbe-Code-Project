import { useState } from 'react';
import type { Todo } from '../types/todo.types';
import { TodoItem } from './TodoItem';
import { TodoForm } from './TodoForm';

interface TodoListProps {
  date: string; // YYYY-MM-DD
  todos: Todo[];
  onAdd: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

export function TodoList({ date, todos, onAdd, onUpdate, onDelete }: TodoListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const handleStatusToggle = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    const nextStatus = todo.status === 'done' ? 'pending' : 'done';
    onUpdate(id, { status: nextStatus });
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleSubmit = (values: Omit<Todo, 'id' | 'createdAt'>) => {
    if (editingTodo) {
      onUpdate(editingTodo.id, values);
    } else {
      onAdd(values);
    }
    setShowForm(false);
    setEditingTodo(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  return (
    <div className="todo-list">
      {todos.length === 0 && !showForm && (
        <p className="todo-list__empty">등록된 할 일이 없습니다.</p>
      )}

      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onStatusToggle={handleStatusToggle}
          onDelete={onDelete}
          onEdit={handleEdit}
        />
      ))}

      {showForm ? (
        <TodoForm
          date={date}
          initialValues={editingTodo ?? undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <button className="btn btn--add" onClick={() => setShowForm(true)}>
          + 할 일 추가
        </button>
      )}
    </div>
  );
}
