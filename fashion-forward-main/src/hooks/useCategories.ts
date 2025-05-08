
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Category {
  id: string;
  name: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name');
      
      if (error) {
        throw error;
      }
      
      setCategories(data as Category[]);
    } catch (error: any) {
      toast.error(`Error loading categories: ${error.message}`);
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCategories();
  }, []);
  
  return {
    categories,
    loading,
    fetchCategories
  };
};
