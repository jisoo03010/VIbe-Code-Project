import { useState } from 'react';
import type { Pattern } from './usePattern';
import { PatternForm } from './PatternForm';
import type { CategoryItem } from '../todo/types/todo.types';

interface PatternListProps {
  patterns: Pattern[];
  categories: CategoryItem[];
  onAdd: (data: Omit<Pattern, 'id'>) => void;
  onUpdate: (id: string, data: Omit<Pattern, 'id'>) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export function PatternList({ patterns, categories, onAdd, onUpdate, onDelete, onBack }: PatternListProps) {
  const [editing, setEditing] = useState<Pattern | 'new' | null>(null);

  if (editing) {
    const isNew = editing === 'new';
    return (
      <PatternForm
        initial={isNew ? undefined : editing}
        categories={categories}
        onCancel={() => setEditing(null)}
        onSave={data => {
          if (isNew) onAdd(data);
          else onUpdate(editing.id, data);
          setEditing(null);
        }}
      />
    );
  }

  return (
    <div className="cat-list">
      <div className="cat-list__header">
        <button className="cat-list__back" onClick={onBack}>‹</button>
        <span className="cat-list__title">반복 패턴</span>
        <span className="cat-list__count">{patterns.length}개</span>
      </div>

      <div className="cat-list__items">
        {patterns.map(pat => (
          <div key={pat.id} className="pat-list__item" onClick={() => setEditing(pat)} style={{ position: 'relative' }}>
            <span className="pat-list__emoji">{pat.emoji}</span>
            <div className="pat-list__body">
              <span className="cat-list__name">{pat.name}</span>
              <span className="pat-list__sub">{pat.todos.length}개 할 일</span>
            </div>
            <span className="cat-list__tasks">{pat.todos.map(t => t.category).filter((v, i, a) => a.indexOf(v) === i).join('·')}</span>
            <button
              className="cat-list__del"
              onClick={e => { e.stopPropagation(); onDelete(pat.id); }}
            >✕</button>
          </div>
        ))}
        {patterns.length === 0 && (
          <div className="pat-list__empty">등록된 패턴이 없습니다</div>
        )}
      </div>

      <button className="cat-list__add" onClick={() => setEditing('new')}>
        + 패턴 추가
      </button>
    </div>
  );
}
