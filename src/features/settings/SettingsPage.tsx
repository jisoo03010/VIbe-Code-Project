import { useState } from 'react';
import type { CategoryItem } from '../todo/types/todo.types';
import { CategoryList } from './CategoryList';
import { PatternList } from './PatternList';
import type { Pattern } from './usePattern';

type Screen = 'main' | 'category' | 'pattern';

interface SettingsPageProps {
  categories: CategoryItem[];
  maxCategories: number;
  taskCounts: Record<string, number>;
  onAddCategory: (name: string, color: string) => Promise<boolean>;
  onUpdateCategory: (id: string, name: string, color: string) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  patterns: Pattern[];
  onAddPattern: (data: Omit<Pattern, 'id'>) => void;
  onUpdatePattern: (id: string, data: Omit<Pattern, 'id'>) => void;
  onDeletePattern: (id: string) => void;
  onSignOut: () => void;
}

export function SettingsPage({
  categories,
  maxCategories,
  taskCounts,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  patterns,
  onAddPattern,
  onUpdatePattern,
  onDeletePattern,
  onSignOut,
}: SettingsPageProps) {
  const [screen, setScreen] = useState<Screen>('main');

  if (screen === 'category') {
    return (
      <CategoryList
        categories={categories}
        maxCategories={maxCategories}
        taskCounts={taskCounts}
        onAdd={onAddCategory}
        onUpdate={onUpdateCategory}
        onDelete={onDeleteCategory}
        onBack={() => setScreen('main')}
      />
    );
  }

  if (screen === 'pattern') {
    return (
      <PatternList
        patterns={patterns}
        categories={categories}
        onAdd={onAddPattern}
        onUpdate={onUpdatePattern}
        onDelete={onDeletePattern}
        onBack={() => setScreen('main')}
      />
    );
  }

  const firstCat = categories[0];

  return (
    <div className="settings-page">
      <h2>설정</h2>
      <div className="settings-list">
        <div className="settings-item">
          <span>알림</span>
          <span className="settings-item__chevron">›</span>
        </div>
        <div className="settings-item settings-item--clickable" onClick={() => setScreen('category')}>
          <div className="settings-item__left">
            {firstCat && <span className="settings-item__dot" style={{ background: firstCat.color }} />}
            <span>카테고리</span>
          </div>
          <div className="settings-item__right">
            <span className="settings-item__value">{categories.length}/{maxCategories}</span>
            <span className="settings-item__chevron">›</span>
          </div>
        </div>
        <div className="settings-item settings-item--clickable" onClick={() => setScreen('pattern')}>
          <div className="settings-item__left">
            <span className="settings-item__icon">🔁</span>
            <span>반복 패턴</span>
          </div>
          <div className="settings-item__right">
            <span className="settings-item__value">{patterns.length}개</span>
            <span className="settings-item__chevron">›</span>
          </div>
        </div>
        <div className="settings-item">
          <span>테마</span>
          <span className="settings-item__chevron">›</span>
        </div>
        <div className="settings-item settings-item--clickable settings-item--danger" onClick={onSignOut}>
          <span>로그아웃</span>
        </div>
      </div>
    </div>
  );
}
