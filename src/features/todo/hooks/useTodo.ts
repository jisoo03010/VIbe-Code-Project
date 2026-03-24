import { useState } from 'react';
import type { Todo } from '../types/todo.types';

const TODAY = new Date().toISOString().split('T')[0];
const YESTERDAY = new Date(Date.now() - 86400000).toISOString().split('T')[0];

const MOCK_TODOS: Todo[] = [
  // 어제 데이터
  { id: '1', content: '알고리즘 문제 3개 풀기', category: '공부', targetTime: 60, status: 'done', date: YESTERDAY, createdAt: new Date() },
  { id: '2', content: '아침 러닝 30분', category: '운동', targetTime: 30, status: 'done', date: YESTERDAY, createdAt: new Date() },
  { id: '3', content: '프로젝트 API 설계', category: '업무', targetTime: 90, status: 'done', date: YESTERDAY, createdAt: new Date() },

  // 오늘 데이터
  { id: '10', content: '리액트 강의 듣기', category: '공부', targetTime: 45, status: 'done', date: TODAY, createdAt: new Date() },
  { id: '11', content: '타입스크립트 복습', category: '공부', targetTime: 30, status: 'pending', date: TODAY, createdAt: new Date() },
  { id: '12', content: '아침 러닝 30분', category: '운동', targetTime: 30, status: 'done', date: TODAY, createdAt: new Date() },
  { id: '13', content: '스트레칭', category: '운동', targetTime: 15, status: 'pending', date: TODAY, createdAt: new Date() },
  { id: '14', content: '주간 회의 참석', category: '업무', targetTime: 30, status: 'done', date: TODAY, createdAt: new Date() },
  { id: '15', content: 'PR 코드 리뷰', category: '업무', targetTime: 60, status: 'pending', date: TODAY, createdAt: new Date() },
  { id: '16', content: '책 읽기 - 클린 코드 3장', category: '개인', targetTime: 40, status: 'pending', date: TODAY, createdAt: new Date() },
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
