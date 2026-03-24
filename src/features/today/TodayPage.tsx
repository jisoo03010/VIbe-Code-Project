import type { Todo } from '../todo/types/todo.types';

interface TodayPageProps {
  todos: Todo[];
  onToggle: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  공부: '#e8f5e9',
  운동: '#fff3e0',
  업무: '#e3f2fd',
  개인: '#fce4ec',
  기타: '#f3e5f5',
};

const CATEGORY_ACCENT: Record<string, string> = {
  공부: '#96ce46',
  운동: '#ffa726',
  업무: '#42a5f5',
  개인: '#ef5350',
  기타: '#ab47bc',
};

function formatDate() {
  const today = new Date();
  return today.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}

export function TodayPage({ todos, onToggle }: TodayPageProps) {
  const doneCount = todos.filter(t => t.status === 'done').length;

  return (
    <div className="today-page">
      <div className="today-header">
        <h2 className="today-header__date">{formatDate()}</h2>
        <p className="today-header__summary">
          {todos.length === 0
            ? '오늘 등록된 할 일이 없습니다'
            : `${todos.length}개 중 ${doneCount}개 완료`}
        </p>
      </div>

      <div className="today-cards">
        {todos.map((todo, idx) => {
          const bg = CATEGORY_COLORS[todo.category] ?? '#f5f5f5';
          const accent = CATEGORY_ACCENT[todo.category] ?? '#96ce46';

          return (
            <div
              key={todo.id}
              className={`todo-card ${todo.status === 'done' ? 'todo-card--done' : ''}`}
              style={{
                background: bg,
                animationDelay: `${idx * 60}ms`,
              }}
              onClick={() => onToggle(todo.id)}
            >
              <div className="todo-card__accent" style={{ background: accent }} />

              <div className="todo-card__body">
                <span className="todo-card__category">{todo.category}</span>
                <span className="todo-card__content">{todo.content}</span>
                {todo.targetTime && (
                  <span className="todo-card__time">{todo.targetTime}분</span>
                )}
              </div>

              <div
                className={`todo-card__check ${todo.status === 'done' ? 'todo-card__check--done' : ''}`}
                style={{ background: todo.status === 'done' ? accent : 'transparent', borderColor: accent }}
              >
                {todo.status === 'done' && '✓'}
              </div>
            </div>
          );
        })}
      </div>

      {todos.length === 0 && (
        <div className="today-empty">
          <span className="today-empty__icon">🫘</span>
          <p>홈에서 날짜를 선택하고<br />할 일을 추가해 보세요!</p>
        </div>
      )}
    </div>
  );
}
