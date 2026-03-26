import { useState } from 'react';
import type { CategoryItem } from '../todo/types/todo.types';
import { CategoryForm } from './CategoryForm';

interface CategoryListProps {
  categories: CategoryItem[];
  maxCategories: number;
  taskCounts: Record<string, number>;
  onAdd: (name: string, color: string) => Promise<boolean>;
  onUpdate: (id: string, name: string, color: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onBack: () => void;
}

export function CategoryList({
  categories,
  maxCategories,
  taskCounts,
  onAdd,
  onUpdate,
  onDelete,
  onBack,
}: CategoryListProps) {
  const [editing, setEditing] = useState<CategoryItem | 'new' | null>(null);

  if (editing) {
    const isNew = editing === 'new';
    return (
      <CategoryForm
        initial={isNew ? undefined : editing}
        onCancel={() => setEditing(null)}
        onSave={async (name, color) => {
          if (isNew) {
            await onAdd(name, color);
          } else {
            await onUpdate(editing.id, name, color);
          }
          setEditing(null);
        }}
      />
    );
  }

  return (
    <div className="cat-list">
      <div className="cat-list__header">
        <button className="cat-list__back" onClick={onBack}>‹</button>
        <span className="cat-list__title">카테고리</span>
        <span className="cat-list__count">{categories.length} / {maxCategories}</span>
      </div>

      <div className="cat-list__items">
        {categories.map(cat => (
          <div key={cat.id} className="cat-list__item" onClick={() => setEditing(cat)}>
            <span className="cat-list__dot" style={{ background: cat.color }} />
            <span className="cat-list__name">{cat.name}</span>
            <span className="cat-list__tasks">{taskCounts[cat.name] ?? 0} tasks</span>
            <button
              className="cat-list__del"
              onClick={e => { e.stopPropagation(); onDelete(cat.id); }}
            >✕</button>
          </div>
        ))}
      </div>

      {categories.length < maxCategories && (
        <button className="cat-list__add" onClick={() => setEditing('new')}>
          + 카테고리 추가
        </button>
      )}
    </div>
  );
}
