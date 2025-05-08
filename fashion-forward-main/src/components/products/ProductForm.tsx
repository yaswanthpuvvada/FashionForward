
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useCategories } from '@/hooks/useCategories';
import { formatPrice } from '@/utils/currency';

interface ProductFormProps {
  initialData?: {
    id?: string;
    name: string;
    description: string;
    price: number;
    discounted_price?: number | null;
    category_id: string;
    in_stock: boolean;
    featured: boolean;
    images?: string[];
  };
  onSubmit: (data: FormData, images: File[]) => Promise<void>;
  isSubmitting: boolean;
}

interface FormData {
  name: string;
  description: string;
  price: number;
  discounted_price: number | null;
  category_id: string;
  in_stock: boolean;
  featured: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting
}) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    defaultValues: initialData || {
      name: '',
      description: '',
      price: 0,
      discounted_price: null,
      category_id: '',
      in_stock: true,
      featured: false
    }
  });
  
  const { categories, loading: loadingCategories } = useCategories();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // Watch values for real-time validation
  const watchDiscountedPrice = watch('discounted_price');
  const watchPrice = watch('price');
  
  const handleFormSubmit = async (data: FormData) => {
    // Validate that discounted price is lower than regular price
    if (data.discounted_price && data.discounted_price >= data.price) {
      toast.error('Discounted price must be lower than regular price');
      return;
    }
    
    // Validate that we have images for new products
    if (!initialData && selectedFiles.length === 0) {
      toast.error('Please upload at least one product image');
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
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          placeholder="Enter product name"
          {...register('name', { required: 'Product name is required' })}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          placeholder="Enter product description"
          rows={4}
          {...register('description', { required: 'Description is required' })}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹) *</Label>
          <Input
            id="price"
            type="number"
            min={0}
            placeholder="Enter price in rupees"
            {...register('price', { 
              required: 'Price is required',
              valueAsNumber: true,
              min: { value: 0, message: 'Price cannot be negative' }
            })}
            onChange={(e) => setValue('price', parseFloat(e.target.value) || 0)}
          />
          {errors.price && (
            <p className="text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="discounted_price">Discounted Price (₹) (optional)</Label>
          <Input
            id="discounted_price"
            type="number"
            min={0}
            placeholder="Enter discounted price"
            {...register('discounted_price', { 
              valueAsNumber: true,
              min: { value: 0, message: 'Discounted price cannot be negative' }
            })}
            onChange={(e) => {
              const value = e.target.value ? parseFloat(e.target.value) : null;
              setValue('discounted_price', value);
            }}
          />
          {watchDiscountedPrice && watchPrice && watchDiscountedPrice >= watchPrice && (
            <p className="text-sm text-red-500">Discounted price must be lower than regular price</p>
          )}
          {errors.discounted_price && (
            <p className="text-sm text-red-500">{errors.discounted_price.message}</p>
          )}
        </div>
      </div>
      
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
        <Label>Images {!initialData && '*'}</Label>
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
          
          {initialData?.images && initialData.images.length > 0 && (
            <>
              <p className="text-sm font-medium">Current Images:</p>
              <div className="grid grid-cols-3 gap-2">
                {initialData.images.map((url, index) => (
                  <img 
                    key={index} 
                    src={url} 
                    alt={`Product ${index}`} 
                    className="h-24 w-24 object-cover rounded"
                  />
                ))}
              </div>
            </>
          )}
        </div>
        {!initialData && selectedFiles.length === 0 && (
          <p className="text-sm text-red-500">At least one image is required</p>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="in_stock"
          checked={watch('in_stock')}
          onCheckedChange={(checked) => setValue('in_stock', checked === true)}
        />
        <Label htmlFor="in_stock" className="font-normal">In Stock</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="featured"
          checked={watch('featured')}
          onCheckedChange={(checked) => setValue('featured', checked === true)}
        />
        <Label htmlFor="featured" className="font-normal">Featured Product</Label>
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : initialData ? 'Update Product' : 'Add Product'}
      </Button>
    </form>
  );
};

export default ProductForm;
