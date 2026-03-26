import { useState } from 'react';
import type { Pattern, PatternTodo } from './usePattern';

const EMOJIS = ['🌅', '📚', '💪', '🧘', '💼', '🎯', '🍳', '🎵', '✍️', '🔥'];

interface PatternFormProps {
  initial?: Pattern;
  categories: { name: string; color: string }[];
  onSave: (data: Omit<Pattern, 'id'>) => void;
  onCancel: () => void;
}

const emptyTodo = (): PatternTodo & { _key: string } => ({
  _key: crypto.randomUUID(),
  content: '',
  category: '',
  targetTime: undefined,
});

export function PatternForm({ initial, categories, onSave, onCancel }: PatternFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [emoji, setEmoji] = useState(initial?.emoji ?? EMOJIS[0]);
  const [items, setItems] = useState<(PatternTodo & { _key: string })[]>(
    initial?.todos.map(t => ({ ...t, _key: crypto.randomUUID() })) ?? [emptyTodo()]
  );

  const canSave = name.trim().length > 0 && items.some(i => i.content.trim());

  const updateItem = (key: string, field: keyof PatternTodo, value: string | number | undefined) => {
    setItems(prev => prev.map(i => i._key === key ? { ...i, [field]: value } : i));
  };

  const removeItem = (key: string) => {
    setItems(prev => prev.filter(i => i._key !== key));
  };

  const handleSave = () => {
    onSave({
      name: name.trim(),
      emoji,
      todos: items
        .filter(i => i.content.trim())
        .map(({ _key: _k, ...rest }) => rest),
    });
  };

  return (
    <div className="pat-form">
      <div className="pat-form__header">
        <button className="cat-form__action" onClick={onCancel}>취소</button>
        <span className="cat-form__title">{initial ? '패턴 수정' : '새 패턴'}</span>
        <button
          className="cat-form__action cat-form__action--primary"
          disabled={!canSave}
          onClick={handleSave}
        >
          완료
        </button>
      </div>

      <div className="cat-form__section">
        <label className="cat-form__label">이모지</label>
        <div className="pat-form__emojis">
          {EMOJIS.map(e => (
            <button
              key={e}
              className={`pat-form__emoji${emoji === e ? ' pat-form__emoji--selected' : ''}`}
              onClick={() => setEmoji(e)}
            >
              {e}
            </button>
          ))}
        </div>
        <label className="cat-form__label" style={{ marginTop: 14 }}>패턴 이름</label>
        <input
          className="cat-form__input"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="예) 아침 루틴"
          maxLength={20}
          autoFocus
        />
      </div>

      <div className="cat-form__section">
        <label className="cat-form__label">할 일 목록</label>
        <div className="pat-form__items">
          {items.map((item, idx) => (
            <div key={item._key} className="pat-form__item">
              <span className="pat-form__item-num">{idx + 1}</span>
              <div className="pat-form__item-fields">
                <input
                  className="pat-form__item-input"
                  value={item.content}
                  onChange={e => updateItem(item._key, 'content', e.target.value)}
                  placeholder="할 일 내용"
                  maxLength={50}
                />
                <div className="pat-form__item-row">
                  <select
                    className="pat-form__item-select"
                    value={item.category}
                    onChange={e => updateItem(item._key, 'category', e.target.value)}
                  >
                    <option value="">카테고리</option>
                    {categories.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <input
                    className="pat-form__item-time"
                    type="number"
                    value={item.targetTime ?? ''}
                    onChange={e => updateItem(item._key, 'targetTime', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="분"
                    min={0}
                    max={999}
                  />
                </div>
              </div>
              {items.length > 1 && (
                <button className="pat-form__item-del" onClick={() => removeItem(item._key)}>✕</button>
              )}
            </div>
          ))}
        </div>
        <button className="pat-form__add-item" onClick={() => setItems(prev => [...prev, emptyTodo()])}>
          + 할 일 추가
        </button>
      </div>
    </div>
  );
}
