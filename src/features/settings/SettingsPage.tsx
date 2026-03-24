import { useState } from 'react';
import type { CategoryItem } from '../todo/types/todo.types';
import { CategoryList } from './CategoryList';

type Screen = 'main' | 'category';

interface SettingsPageProps {
  categories: CategoryItem[];
  maxCategories: number;
  taskCounts: Record<string, number>;
  onAddCategory: (name: string, color: string) => boolean;
  onUpdateCategory: (id: string, name: string, color: string) => void;
  onDeleteCategory: (id: string) => void;
}

export function SettingsPage({
  categories,
  maxCategories,
  taskCounts,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
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
        <div className="settings-item">
          <span>테마</span>
          <span className="settings-item__chevron">›</span>
        </div>
        <div className="settings-item">
          <span>계정</span>
          <span className="settings-item__chevron">›</span>
        </div>
      </div>
    </div>
  );
}
