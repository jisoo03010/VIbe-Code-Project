import { useEffect, useState, useCallback } from 'react';
import type { Todo } from '../types/todo.types';
import { supabase } from '../../../shared/lib/supabase';

function rowToTodo(row: Record<string, unknown>): Todo {
  return {
    id: row.id as string,
    content: row.content as string,
    category: row.category as string,
    targetTime: row.target_time as number | undefined,
    status: row.status as 'pending' | 'done',
    date: row.date as string,
    createdAt: new Date(row.created_at as string),
  };
}

async function getUserId() {
  const { data } = await supabase.auth.getUser();
  return data.user?.id;
}

export function useTodo() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: true })
      .then((result) => {
        if (!result.error && result.data) setTodos(result.data.map(rowToTodo));
      });
  }, []);

  const addTodo = useCallback(async (todo: Omit<Todo, 'id' | 'createdAt'>) => {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from('todos')
      .insert({
        user_id: userId,
        content: todo.content,
        category: todo.category,
        target_time: todo.targetTime ?? null,
        status: todo.status,
        date: todo.date,
      })
      .select()
      .single();
    if (!error && data) setTodos(prev => [...prev, rowToTodo(data)]);
  }, []);

  const updateTodo = useCallback(async (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.content !== undefined) dbUpdates.content = updates.content;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.targetTime !== undefined) dbUpdates.target_time = updates.targetTime;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.date !== undefined) dbUpdates.date = updates.date;

    const { error } = await supabase.from('todos').update(dbUpdates).eq('id', id);
    if (!error) setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTodo = useCallback(async (id: string) => {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (!error) setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  const getTodosForDate = useCallback(
    (date: string) => todos.filter(t => t.date === date),
    [todos]
  );

  const getCompletionRate = useCallback((date: string) => {
    const dayTodos = todos.filter(t => t.date === date);
    if (dayTodos.length === 0) return 0;
    return dayTodos.filter(t => t.status === 'done').length / dayTodos.length;
  }, [todos]);

  const getMonthlyDoneCount = useCallback((yearMonth: string) =>
    todos.filter(t => t.date.startsWith(yearMonth) && t.status === 'done').length,
    [todos]
  );

  return { todos, addTodo, updateTodo, deleteTodo, getTodosForDate, getCompletionRate, getMonthlyDoneCount };
}
