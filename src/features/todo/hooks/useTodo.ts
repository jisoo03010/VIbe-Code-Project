import { useState } from 'react';
import type { Todo } from '../types/todo.types';

const MOCK_TODOS: Todo[] = [
  { id: '1', content: '알고리즘 문제 3개 풀기', category: '공부', targetTime: 60, status: 'done', date: '2026-03-23', createdAt: new Date('2026-03-23T08:00:00') },
  { id: '2', content: '아침 러닝 30분', category: '운동', targetTime: 30, status: 'done', date: '2026-03-23', createdAt: new Date('2026-03-23T07:00:00') },
  { id: '3', content: '아침 러닝 30분', category: '운동', targetTime: 30, status: 'done', date: '2026-03-23', createdAt: new Date('2026-03-23T07:00:00') },
  { id: '4', content: '아침 러닝 30분', category: '운동', targetTime: 30, status: 'done', date: '2026-03-23', createdAt: new Date('2026-03-23T07:00:00') },
  { id: '5', content: '아침 러닝 30분', category: '운동', targetTime: 30, status: 'done', date: '2026-03-23', createdAt: new Date('2026-03-23T07:00:00') },
  { id: '6', content: '아침 러닝 30분', category: '운동', targetTime: 30, status: 'done', date: '2026-03-23', createdAt: new Date('2026-03-23T07:00:00') },
  { id: '7', content: '아침 러닝 30분', category: '운동', targetTime: 30, status: 'done', date: '2026-03-23', createdAt: new Date('2026-03-23T07:00:00') },
  { id: '8', content: '아침 러닝 30분', category: '운동', targetTime: 30, status: 'done', date: '2026-03-23', createdAt: new Date('2026-03-23T07:00:00') },
  { id: '9', content: '아침 러닝 30분', category: '운동', targetTime: 30, status: 'done', date: '2026-03-23', createdAt: new Date('2026-03-23T07:00:00') },
  { id: '10', content: '프로젝트 API 설계', category: '업무', targetTime: 90, status: 'in-progress', date: '2026-03-23', createdAt: new Date('2026-03-23T₀₉:₀₀:₀₀') },
  { id: '11', content: '책 읽기 - 클린 코드 3장', category: '개인', targetTime: 40, status: 'done', date: '2026-03-23', createdAt: new Date('2026-₀₃-₂₃T₁₀:₀₀:₀₀') },
  { id: '12', content: '영화 보기 - 인셉션', category: '개인', status: 'done', date: '2026-03-23', createdAt: new Date('2026-03-23T12:00:00') },
  { id: '13', content: '저녁 식사 준비', category: '개인', targetTime: 60, status: 'done', date: '2026-03-23', createdAt: new Date('2026-03-23T17:00:00') },
  { id: '14', content: '주간 회의 참석', category: '업무', targetTime: 30, status: 'done', date: '2026-03-23', createdAt: new Date('2026-03-23T15:00:00') },
  { id: '15', content: '주간 회의 참석', category: '업무', targetTime: 30, status: 'done', date: '2026-03-23', createdAt: new Date('2026-03-23T15:00:00') },
  { id: '16', content: '주간 회의 참석', category: '업무', targetTime: 30, status: 'done', date: '2026-03-23', createdAt: new Date('2026-03-23T15:00:00') },
  { id: '17', content: '주간 회의 참석', category: '업무', targetTime: 30, status: 'done', date: '2026-03-23', createdAt: new Date('2026-03-23T15:00:00') },
  { id: '18', content: '주간 회의 참석', category: '업무', targetTime: 30, status: 'done', date: '2026-03-23', createdAt: new Date('2026-03-23T15:00:00') },
  { id: '19', content: '주간 회의 참석', category: '업무', targetTime: 30, status: 'done', date: '2026-03-23', createdAt: new Date('2026-03-23T15:00:00') },
  { id: '20', content: '주간 회의 참석', category: '업무', targetTime: 30, status: 'done', date: '2026-03-23', createdAt: new Date('2026-03-23T15:00:00') },
  { id: '21', content: '주간 회의 참석', category: '업무', targetTime: 30, status: 'done', date: '2026-03-23', createdAt: new Date('2026-03-23T15:00:00') },
  { id: '22', content: '주간 회의 참석', category: '업무', targetTime: 30, status: 'done', date: '2026-03-23', createdAt: new Date('2026-03-23T15:00:00') },
  { id: '23', content: '주간 회의 참석', category: '업무', targetTime: 30, status: 'done', date: '2026-03-23', createdAt: new Date('2026-03-23T15:00:00') },
];

export function useTodo() {
  const [todos, setTodos] = useState<Todo[]>(MOCK_TODOS);

  const addTodo = (todo: Omit<Todo, 'id' | 'createdAt'>) => {
    setTodos(prev => [
      ...prev,
      { ...todo, id: crypto.randomUUID(), createdAt: new Date() },
    ]);
  };

  const updateTodo = (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const getTodosForDate = (date: string) => todos.filter(t => t.date === date);

  const getCompletionRate = (date: string) => {
    const dayTodos = getTodosForDate(date);
    if (dayTodos.length === 0) return 0;
    const done = dayTodos.filter(t => t.status === 'done').length;
    return done / dayTodos.length;
  };

  /** 해당 월의 누적 완료 개수 (YYYY-MM) */
  const getMonthlyDoneCount = (yearMonth: string) =>
    todos.filter(t => t.date.startsWith(yearMonth) && t.status === 'done').length;

  return { todos, addTodo, updateTodo, deleteTodo, getTodosForDate, getCompletionRate, getMonthlyDoneCount };
}
