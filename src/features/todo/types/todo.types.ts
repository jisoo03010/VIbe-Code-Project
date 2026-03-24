export interface CategoryItem {
  id: string;
  name: string;
  color: string;
}

export type TodoStatus = 'pending' | 'in-progress' | 'done';

export interface Todo {
  id: string;
  content: string;
  category: string;
  targetTime?: number; // 목표 시간 (분)
  status: TodoStatus;
  date: string; // YYYY-MM-DD
  createdAt: Date;
}
