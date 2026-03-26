import type { Todo } from '../todo/types/todo.types';

interface TodayPageProps {
  todos: Todo[];
}

function daysAgoStr(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function getStreak(todos: Todo[]): number {
  let streak = 0;
  let i = 0;
  while (true) {
    const dateStr = daysAgoStr(i);
    const dayTodos = todos.filter(t => t.date === dateStr);
    if (dayTodos.length === 0) break;
    const allDone = dayTodos.some(t => t.status === 'done');
    if (!allDone) break;
    streak++;
    i++;
  }
  return streak;
}

function getWeeklyData(todos: Todo[]) {
  return Array.from({ length: 7 }, (_, i) => {
    const dateStr = daysAgoStr(6 - i);
    const dayTodos = todos.filter(t => t.date === dateStr);
    const done = dayTodos.filter(t => t.status === 'done').length;
    const total = dayTodos.length;
    return { dateStr, done, total, rate: total > 0 ? done / total : 0 };
  });
}

function getCategoryStats(todos: Todo[]) {
  const map: Record<string, { done: number; total: number }> = {};
  for (const t of todos) {
    if (!map[t.category]) map[t.category] = { done: 0, total: 0 };
    map[t.category].total++;
    if (t.status === 'done') map[t.category].done++;
  }
  return Object.entries(map)
    .map(([name, { done, total }]) => ({ name, done, total, rate: done / total }))
    .sort((a, b) => b.total - a.total);
}

function getPercentile(streak: number, weeklyDone: number): number {
  // Simplified scoring: combine streak and weekly done count
  const score = streak * 10 + weeklyDone * 5;
  if (score >= 120) return 1;
  if (score >= 90) return 3;
  if (score >= 70) return 5;
  if (score >= 50) return 10;
  if (score >= 35) return 20;
  if (score >= 20) return 35;
  if (score >= 10) return 50;
  return 70;
}

function getWeekdayLabel(dateStr: string) {
  const day = new Date(dateStr).getDay();
  return ['일', '월', '화', '수', '목', '금', '토'][day];
}

function getHeatColor(rate: number, hasData: boolean) {
  if (!hasData) return '#f0f0f0';
  if (rate === 0) return '#ffd6d6';
  if (rate < 0.4) return '#d4edac';
  if (rate < 0.7) return '#acd870';
  return '#96ce46';
}

export function TodayPage({ todos }: TodayPageProps) {
  const todayStr = daysAgoStr(0);
  const streak = getStreak(todos);
  const weeklyData = getWeeklyData(todos);
  const weeklyDone = weeklyData.reduce((sum, d) => sum + d.done, 0);
  const weeklyTotal = weeklyData.reduce((sum, d) => sum + d.total, 0);
  const weeklyRate = weeklyTotal > 0 ? Math.round((weeklyDone / weeklyTotal) * 100) : 0;
  const categoryStats = getCategoryStats(todos.filter(t => t.date >= daysAgoStr(6)));
  const percentile = getPercentile(streak, weeklyDone);
  const todayTodos = todos.filter(t => t.date === todayStr);
  const todayDone = todayTodos.filter(t => t.status === 'done').length;

  return (
    <div className="today-page">
      <div className="analytics-header">
        <span className="analytics-header__title">나의 기록</span>
        <span className="analytics-header__sub">최근 7일 분석</span>
      </div>

      {/* 상단 요약 카드 */}
      <div className="analytics-summary">
        <div className="analytics-card analytics-card--streak">
          <span className="analytics-card__icon">🔥</span>
          <span className="analytics-card__value">{streak}일</span>
          <span className="analytics-card__label">연속 달성</span>
        </div>
        <div className="analytics-card analytics-card--weekly">
          <span className="analytics-card__icon">✅</span>
          <span className="analytics-card__value">{weeklyDone}개</span>
          <span className="analytics-card__label">7일 완료</span>
        </div>
        <div className="analytics-card analytics-card--rate">
          <span className="analytics-card__icon">📊</span>
          <span className="analytics-card__value">{weeklyRate}%</span>
          <span className="analytics-card__label">완료율</span>
        </div>
      </div>

      {/* 주간 히트맵 */}
      <div className="analytics-section">
        <span className="analytics-section__title">이번 주 달성 현황</span>
        <div className="heatmap">
          {weeklyData.map(day => {
            const isToday = day.dateStr === todayStr;
            return (
              <div key={day.dateStr} className={`heatmap__cell${isToday ? ' heatmap__cell--today' : ''}`}>
                <div
                  className="heatmap__block"
                  style={{ background: getHeatColor(day.rate, day.total > 0) }}
                >
                  {day.total > 0 && (
                    <span className="heatmap__count">{day.done}/{day.total}</span>
                  )}
                </div>
                <span className="heatmap__label">{getWeekdayLabel(day.dateStr)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 카테고리별 분포 */}
      {categoryStats.length > 0 && (
        <div className="analytics-section">
          <span className="analytics-section__title">카테고리별 달성</span>
          <div className="cat-bars">
            {categoryStats.map(cat => (
              <div key={cat.name} className="cat-bar">
                <div className="cat-bar__info">
                  <span className="cat-bar__name">{cat.name}</span>
                  <span className="cat-bar__stat">{cat.done}/{cat.total}</span>
                </div>
                <div className="cat-bar__track">
                  <div
                    className="cat-bar__fill"
                    style={{ width: `${Math.round(cat.rate * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 오늘 진행 현황 */}
      <div className="analytics-section">
        <span className="analytics-section__title">오늘의 진행</span>
        <div className="today-progress">
          <div className="today-progress__ring-wrap">
            <svg className="today-progress__ring" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" className="today-progress__ring-bg" />
              <circle
                cx="32" cy="32" r="26"
                className="today-progress__ring-fill"
                strokeDasharray={`${todayTodos.length > 0 ? (todayDone / todayTodos.length) * 163.4 : 0} 163.4`}
                strokeDashoffset="0"
                transform="rotate(-90 32 32)"
              />
            </svg>
            <span className="today-progress__text">
              {todayTodos.length > 0 ? Math.round((todayDone / todayTodos.length) * 100) : 0}%
            </span>
          </div>
          <div className="today-progress__detail">
            <div className="today-progress__row">
              <span className="today-progress__dot today-progress__dot--done" />
              <span>완료 {todayDone}개</span>
            </div>
            <div className="today-progress__row">
              <span className="today-progress__dot today-progress__dot--pending" />
              <span>남은 {todayTodos.length - todayDone}개</span>
            </div>
            <div className="today-progress__row">
              <span className="today-progress__dot today-progress__dot--total" />
              <span>전체 {todayTodos.length}개</span>
            </div>
          </div>
        </div>
      </div>

      {/* 퍼센타일 */}
      <div className="percentile-card">
        <div className="percentile-card__badge">상위 {percentile}%</div>
        <div className="percentile-card__body">
          <span className="percentile-card__title">
            {percentile <= 5 ? '🏆 탁월한 실행력이에요!' :
             percentile <= 20 ? '🌟 꾸준함이 빛나고 있어요!' :
             percentile <= 50 ? '🌱 좋은 습관을 만들고 있어요!' :
             '💪 오늘도 한 걸음씩 나아가요!'}
          </span>
          <span className="percentile-card__sub">
            7일간 {weeklyDone}개 완료 · {streak}일 연속 달성
          </span>
        </div>
        <div className="percentile-bar">
          <div className="percentile-bar__fill" style={{ width: `${100 - percentile}%` }} />
          <span className="percentile-bar__marker" style={{ left: `${100 - percentile}%` }} />
        </div>
      </div>
    </div>
  );
}
