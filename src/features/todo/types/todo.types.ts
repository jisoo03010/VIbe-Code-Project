export type Category = '공부' | '운동' | '업무' | '개인' | '기타';

export type TodoStatus = 'pending' | 'in-progress' | 'done';

export interface Todo {
  id: string;
  content: string;
  category: Category;
  targetTime?: number; // 목표 시간 (분)
  status: TodoStatus;
  date: string; // YYYY-MM-DD
  createdAt: Date;
}
