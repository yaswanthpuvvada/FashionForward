
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useCategories } from '@/hooks/useCategories';

interface DonationFormProps {
  onSubmit: (data: FormData, images: File[]) => Promise<void>;
  isSubmitting: boolean;
}

interface FormData {
  title: string;
  description: string;
  category_id: string;
  condition: string;
  gender: string;
  size: string;
  location: string;
}

const DonationForm: React.FC<DonationFormProps> = ({
  onSubmit,
  isSubmitting
}) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      category_id: '',
      condition: 'good',
      gender: 'unisex',
      size: '',
      location: ''
    }
  });
  
  const { categories, loading: loadingCategories } = useCategories();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const handleFormSubmit = async (data: FormData) => {
    // Validate that we have images
    if (selectedFiles.length === 0) {
      toast.error('Please upload at least one image of your donation');
      return;
    }
    
    await onSubmit(data, selectedFiles);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newFiles = Array.from(files);
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };
  
  const removeFile = (index: number) => {
    setSelectedFiles(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          placeholder="e.g., Winter Clothes Donation"
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          placeholder="Describe what you're donating and any relevant details"
          rows={4}
          {...register('description', { required: 'Description is required' })}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={watch('category_id')}
            onValueChange={(value) => setValue('category_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {loadingCategories ? (
                <SelectItem value="loading" disabled>Loading categories...</SelectItem>
              ) : (
                categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {errors.category_id && (
            <p className="text-sm text-red-500">{errors.category_id.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="condition">Condition *</Label>
          <Select
            value={watch('condition')}
            onValueChange={(value) => setValue('condition', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New (with tags)</SelectItem>
              <SelectItem value="like-new">Like New (no signs of wear)</SelectItem>
              <SelectItem value="good">Good (minor signs of wear)</SelectItem>
              <SelectItem value="fair">Fair (visible wear but still usable)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={watch('gender')}
            onValueChange={(value) => setValue('gender', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unisex">Unisex</SelectItem>
              <SelectItem value="men">Men</SelectItem>
              <SelectItem value="women">Women</SelectItem>
              <SelectItem value="children">Children</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="size">Size (optional)</Label>
          <Input
            id="size"
            placeholder="e.g., S, M, L, XL, 42, etc."
            {...register('size')}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location (optional)</Label>
        <Input
          id="location"
          placeholder="e.g., Mumbai, Delhi, etc."
          {...register('location')}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Images *</Label>
        <div className="border rounded p-4 space-y-4">
          <Input 
            type="file" 
            accept="image/*"
            multiple 
            onChange={handleFileChange}
            className="mb-2"
          />
          
          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative">
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={`Preview ${index}`} 
                    className="h-24 w-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    onClick={() => removeFile(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {selectedFiles.length === 0 && (
          <p className="text-sm text-red-500">At least one image is required</p>
        )}
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Donation'}
      </Button>
    </form>
  );
};

export default DonationForm;
