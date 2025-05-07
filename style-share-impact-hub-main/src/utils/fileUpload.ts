
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const uploadImage = async (
  file: File,
  bucket: string = 'products',
  folder: string = ''
): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });
      
    if (error) {
      throw error;
    }
    
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  } catch (error: any) {
    toast.error(`Error uploading file: ${error.message}`);
    return null;
  }
};

export const uploadMultipleImages = async (
  files: File[],
  bucket: string = 'products',
  folder: string = ''
): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadImage(file, bucket, folder));
  const urls = await Promise.all(uploadPromises);
  return urls.filter(url => url !== null) as string[];
};
