export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  completionRate?: number; // 완료율 0~1 (날짜 셀 배경색 시각화에 사용)
}

export type ViewType = 'month' | 'week';
