
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export interface Product {
  id: string;
  seller_id: string;
  name: string;
  description: string;
  price: number;
  discounted_price: number | null;
  category_id: string;
  in_stock: boolean;
  featured: boolean;
  rating: number;
  reviews: number;
  images: string[];
  date_added: string;
  updated_at: string;
}

interface ProductWithCategory extends Product {
  categories: {
    name: string;
  } | null;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  discounted_price?: number | null;
  category_id: string;
  in_stock: boolean;
  featured: boolean;
  images: File[];
}

export const useProducts = (sellerId?: string) => {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*, categories:category_id (name)');
      
      if (sellerId) {
        query = query.eq('seller_id', sellerId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setProducts(data as ProductWithCategory[]);
    } catch (error: any) {
      toast.error(`Error loading products: ${error.message}`);
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, [sellerId]);
  
  const addProduct = async (formData: ProductFormData, imageFiles: File[]) => {
    if (!user) {
      toast.error('You must be logged in to add a product');
      return null;
    }
    
    setLoading(true);
    try {
      // 1. Upload images
      const uploadPromises = imageFiles.map(file => {
        return new Promise<string | null>(async (resolve) => {
          try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
            const filePath = `products/${fileName}`;
            
            const { error } = await supabase.storage
              .from('products')
              .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
              });
              
            if (error) throw error;
            
            const { data } = supabase.storage
              .from('products')
              .getPublicUrl(filePath);
              
            resolve(data.publicUrl);
          } catch (error: any) {
            console.error(`Error uploading image: ${error.message}`);
            resolve(null);
          }
        });
      });
      
      const imageUrls = await Promise.all(uploadPromises);
      const validImageUrls = imageUrls.filter(url => url !== null) as string[];
      
      if (validImageUrls.length === 0) {
        throw new Error('Failed to upload images');
      }
      
      // 2. Create product
      const { data, error } = await supabase
        .from('products')
        .insert({
          seller_id: user.id,
          name: formData.name,
          description: formData.description,
          price: formData.price,
          discounted_price: formData.discounted_price || null,
          category_id: formData.category_id,
          in_stock: formData.in_stock,
          featured: formData.featured,
          images: validImageUrls,
        })
        .select('*, categories:category_id (name)')
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success('Product added successfully!');
      setProducts(prev => [...prev, data as ProductWithCategory]);
      return data;
    } catch (error: any) {
      toast.error(`Error adding product: ${error.message}`);
      console.error('Error adding product:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const updateProduct = async (id: string, formData: Partial<ProductFormData>, imageFiles?: File[]) => {
    setLoading(true);
    try {
      let imageUrls: string[] = [];
      
      // 1. Upload new images if provided
      if (imageFiles && imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(file => {
          return new Promise<string | null>(async (resolve) => {
            try {
              const fileExt = file.name.split('.').pop();
              const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
              const filePath = `products/${fileName}`;
              
              const { error } = await supabase.storage
                .from('products')
                .upload(filePath, file, {
                  cacheControl: '3600',
                  upsert: false,
                });
                
              if (error) throw error;
              
              const { data } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);
                
              resolve(data.publicUrl);
            } catch (error: any) {
              console.error(`Error uploading image: ${error.message}`);
              resolve(null);
            }
          });
        });
        
        const newImageUrls = await Promise.all(uploadPromises);
        imageUrls = newImageUrls.filter(url => url !== null) as string[];
      }
      
      // Get existing product for images
      if (imageFiles && imageFiles.length > 0) {
        const { data: existingProduct } = await supabase
          .from('products')
          .select('images')
          .eq('id', id)
          .single();
          
        if (existingProduct) {
          imageUrls = [...existingProduct.images, ...imageUrls];
        }
      }
      
      // 2. Update product
      const updateData: any = { ...formData };
      if (imageUrls.length > 0) {
        updateData.images = imageUrls;
      }
      
      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select('*, categories:category_id (name)')
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success('Product updated successfully!');
      setProducts(prev => prev.map(p => p.id === id ? data as ProductWithCategory : p));
      return data;
    } catch (error: any) {
      toast.error(`Error updating product: ${error.message}`);
      console.error('Error updating product:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const deleteProduct = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast.success('Product deleted successfully!');
      setProducts(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (error: any) {
      toast.error(`Error deleting product: ${error.message}`);
      console.error('Error deleting product:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    products,
    loading,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct
  };
};
