import { useEffect, useState, useCallback } from 'react';
import type { CategoryItem } from '../todo/types/todo.types';
import { supabase } from '../../shared/lib/supabase';

export const MAX_CATEGORIES = 10;

const DEFAULT_CATEGORIES = [
  { name: '공부', color: '#42a5f5' },
  { name: '운동', color: '#96ce46' },
  { name: '업무', color: '#ef5350' },
  { name: '개인', color: '#ab47bc' },
  { name: '기타', color: '#8d6e63' },
];

async function getUserId() {
  const { data } = await supabase.auth.getUser();
  return data.user?.id;
}

export function useCategory() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true })
      .then(async ({ data, error }) => {
        if (error) return;
        if (data.length > 0) {
          setCategories(data as CategoryItem[]);
          return;
        }
        // 첫 로그인 시 기본 카테고리 삽입 (중복 방지: count 재확인)
        const { count } = await supabase
          .from('categories')
          .select('*', { count: 'exact', head: true });
        if ((count ?? 0) > 0) return;
        const userId = await getUserId();
        const { data: inserted } = await supabase
          .from('categories')
          .insert(DEFAULT_CATEGORIES.map(c => ({ ...c, user_id: userId })))
          .select();
        if (inserted) setCategories(inserted as CategoryItem[]);
      });
  }, []);

  const addCategory = useCallback(async (name: string, color: string): Promise<boolean> => {
    if (categories.length >= MAX_CATEGORIES) return false;
    const userId = await getUserId();
    const { data, error } = await supabase
      .from('categories')
      .insert({ name, color, user_id: userId })
      .select()
      .single();
    if (!error && data) setCategories(prev => [...prev, data as CategoryItem]);
    return !error;
  }, [categories.length]);

  const updateCategory = useCallback(async (id: string, name: string, color: string) => {
    const { error } = await supabase
      .from('categories')
      .update({ name, color })
      .eq('id', id);
    if (!error) setCategories(prev => prev.map(c => c.id === id ? { ...c, name, color } : c));
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  return { categories, maxCategories: MAX_CATEGORIES, addCategory, updateCategory, deleteCategory };
}
