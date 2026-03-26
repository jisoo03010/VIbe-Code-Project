import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../shared/lib/supabase';

async function getUserId() {
  const { data } = await supabase.auth.getUser();
  return data.user?.id;
}

export interface PatternTodo {
  content: string;
  category: string;
  targetTime?: number;
}

export interface Pattern {
  id: string;
  name: string;
  emoji: string;
  todos: PatternTodo[];
}

type PatternRow = {
  id: string;
  name: string;
  emoji: string;
  pattern_todos: { content: string; category: string; target_time: number | null; sort_order: number }[];
};

function rowToPattern(p: PatternRow): Pattern {
  return {
    id: p.id,
    name: p.name,
    emoji: p.emoji,
    todos: [...p.pattern_todos]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(t => ({
        content: t.content,
        category: t.category,
        targetTime: t.target_time ?? undefined,
      })),
  };
}

export function usePattern() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);

  const loadPatterns = useCallback(() => {
    supabase
      .from('patterns')
      .select('*, pattern_todos(*)')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setPatterns((data as PatternRow[]).map(rowToPattern));
      });
  }, []);

  useEffect(() => { loadPatterns(); }, [loadPatterns]);

  const addPattern = useCallback(async (data: Omit<Pattern, 'id'>) => {
    const userId = await getUserId();
    const { data: pattern, error } = await supabase
      .from('patterns')
      .insert({ name: data.name, emoji: data.emoji, user_id: userId })
      .select()
      .single();
    if (error || !pattern) return;

    if (data.todos.length > 0) {
      await supabase.from('pattern_todos').insert(
        data.todos.map((t, i) => ({
          pattern_id: pattern.id,
          content: t.content,
          category: t.category,
          target_time: t.targetTime ?? null,
          sort_order: i,
        }))
      );
    }
    loadPatterns();
  }, [loadPatterns]);

  const updatePattern = useCallback(async (id: string, data: Omit<Pattern, 'id'>) => {
    await supabase.from('patterns').update({ name: data.name, emoji: data.emoji }).eq('id', id);
    await supabase.from('pattern_todos').delete().eq('pattern_id', id);
    if (data.todos.length > 0) {
      await supabase.from('pattern_todos').insert(
        data.todos.map((t, i) => ({
          pattern_id: id,
          content: t.content,
          category: t.category,
          target_time: t.targetTime ?? null,
          sort_order: i,
        }))
      );
    }
    loadPatterns();
  }, [loadPatterns]);

  const deletePattern = useCallback(async (id: string) => {
    const { error } = await supabase.from('patterns').delete().eq('id', id);
    if (!error) setPatterns(prev => prev.filter(p => p.id !== id));
  }, []);

  return { patterns, addPattern, updatePattern, deletePattern };
}
