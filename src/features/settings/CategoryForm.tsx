import { useState } from 'react';
import type { CategoryItem } from '../todo/types/todo.types';

const PALETTE = [
  '#ef5350', '#e67c52', '#ffa726', '#66bb6a', '#26a69a',
  '#42a5f5', '#7e57c2', '#ec407a', '#9e9e9e', '#8d6e63',
];

interface CategoryFormProps {
  initial?: CategoryItem;
  onSave: (name: string, color: string) => void;
  onCancel: () => void;
}

export function CategoryForm({ initial, onSave, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [color, setColor] = useState(initial?.color ?? PALETTE[0]);

  const canSave = name.trim().length > 0;

  return (
    <div className="cat-form">
      <div className="cat-form__header">
        <button className="cat-form__action" onClick={onCancel}>취소</button>
        <span className="cat-form__title">{initial ? '카테고리 수정' : '새 카테고리'}</span>
        <button
          className="cat-form__action cat-form__action--primary"
          disabled={!canSave}
          onClick={() => onSave(name.trim(), color)}
        >
          완료
        </button>
      </div>

      <div className="cat-form__section">
        <label className="cat-form__label">이름</label>
        <input
          className="cat-form__input"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="카테고리 이름"
          maxLength={10}
          autoFocus
        />
      </div>

      <div className="cat-form__section">
        <label className="cat-form__label">색상</label>
        <div className="cat-form__palette">
          {PALETTE.map(c => (
            <button
              key={c}
              className={`cat-form__color${color === c ? ' cat-form__color--selected' : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
              aria-label={c}
            />
          ))}
        </div>
      </div>

      <div className="cat-form__section">
        <label className="cat-form__label">미리보기</label>
        <div className="cat-form__preview">
          <span className="cat-form__preview-dot" style={{ background: color }} />
          <span className="cat-form__preview-name">{name || '카테고리'}</span>
        </div>
      </div>
    </div>
  );
}
