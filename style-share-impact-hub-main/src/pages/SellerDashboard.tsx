
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/utils/currency';
import { toast } from 'sonner';

interface ProductFormState {
  name: string;
  description: string;
  price: number;
  discountedPrice: number | null;
  category: string;
  inStock: boolean;
  featured: boolean;
  images: string[];
}

const initialProductState: ProductFormState = {
  name: '',
  description: '',
  price: 0,
  discountedPrice: null,
  category: '',
  inStock: true,
  featured: false,
  images: ['https://via.placeholder.com/400x400?text=Product+Image'],
};

const SellerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [productFormData, setProductFormData] = useState<ProductFormState>(initialProductState);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };
    
    fetchCategories();
  }, []);

  // Fetch products and orders
  useEffect(() => {
    if (user?.id) {
      const fetchSellerData = async () => {
        setLoading(true);
        
        try {
          // Fetch seller's products
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select(`
              *,
              category:categories(name)
            `)
            .eq('seller_id', user.id)
            .order('date_added', { ascending: false });
          
          if (productsError) throw productsError;
          
          // Fetch orders for seller's products
          const { data: ordersData, error: ordersError } = await supabase
            .from('order_items')
            .select(`
              *,
              order:orders(*),
              product:products(*)
            `)
            .in('product_id', productsData.map(p => p.id));
          
          if (ordersError) throw ordersError;
          
          setProducts(productsData || []);
          
          // Group order items by order
          const orderMap = new Map();
          ordersData?.forEach(item => {
            if (!orderMap.has(item.order.id)) {
              orderMap.set(item.order.id, {
                ...item.order,
                items: []
              });
            }
            orderMap.get(item.order.id).items.push({
              ...item,
              product: item.product
            });
          });
          
          setOrders(Array.from(orderMap.values()));
        } catch (error) {
          console.error('Error fetching seller data:', error);
          toast.error('Failed to load seller data');
        } finally {
          setLoading(false);
        }
      };
      
      fetchSellerData();
    }
  }, [user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (name === 'price' || name === 'discountedPrice') {
      const parsedValue = value === '' ? null : parseInt(value, 10);
      setProductFormData(prev => ({
        ...prev,
        [name]: parsedValue
      }));
    } else if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setProductFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setProductFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productFormData.name || !productFormData.description) {
      toast.error('Please fill all required fields');
      return;
    }
    
    if (productFormData.price <= 0) {
      toast.error('Price must be greater than zero');
      return;
    }
    
    if (productFormData.discountedPrice && productFormData.discountedPrice >= productFormData.price) {
      toast.error('Discounted price must be less than regular price');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (editingProductId) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update({
            name: productFormData.name,
            description: productFormData.description,
            price: productFormData.price,
            discounted_price: productFormData.discountedPrice,
            category_id: productFormData.category || null,
            in_stock: productFormData.inStock,
            featured: productFormData.featured,
            images: productFormData.images,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingProductId);
        
        if (error) throw error;
        
        toast.success('Product updated successfully');
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert({
            seller_id: user?.id,
            name: productFormData.name,
            description: productFormData.description,
            price: productFormData.price,
            discounted_price: productFormData.discountedPrice,
            category_id: productFormData.category || null,
            in_stock: productFormData.inStock,
            featured: productFormData.featured,
            images: productFormData.images
          });
        
        if (error) throw error;
        
        toast.success('Product added successfully');
      }
      
      // Reset form and refresh products list
      setProductFormData(initialProductState);
      setEditingProductId(null);
      
      // Reload products
      const { data: updatedProducts, error: fetchError } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('seller_id', user?.id)
        .order('date_added', { ascending: false });
      
      if (fetchError) throw fetchError;
      
      setProducts(updatedProducts || []);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProductId(product.id);
    setProductFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      discountedPrice: product.discounted_price,
      category: product.category_id,
      inStock: product.in_stock,
      featured: product.featured,
      images: product.images
    });
    setActiveTab('add-product');
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      
      setProducts(products.filter(p => p.id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setProductFormData(initialProductState);
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['seller']}>
        <Layout>
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['seller']}>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Seller Dashboard</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="products">My Products</TabsTrigger>
              <TabsTrigger value="add-product">
                {editingProductId ? 'Edit Product' : 'Add Product'}
              </TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>
            
            {/* Products Tab */}
            <TabsContent value="products">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">My Products</h2>
                  <Button onClick={() => setActiveTab('add-product')}>
                    Add New Product
                  </Button>
                </div>
                
                {products.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">No products yet</h3>
                    <p className="text-gray-500 mb-4">
                      You haven't added any products to your store yet.
                    </p>
                    <Button onClick={() => setActiveTab('add-product')}>
                      Add Your First Product
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Image</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <img 
                                src={product.images[0]} 
                                alt={product.name}
                                className="h-12 w-12 object-cover rounded"
                              />
                            </TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>
                              {product.discounted_price ? (
                                <div>
                                  <span className="font-medium">{formatPrice(product.discounted_price)}</span>
                                  <span className="line-through text-gray-400 text-xs ml-2">
                                    {formatPrice(product.price)}
                                  </span>
                                </div>
                              ) : (
                                <span>{formatPrice(product.price)}</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                ${product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {product.in_stock ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </TableCell>
                            <TableCell>{product.category?.name || 'Uncategorized'}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Add/Edit Product Tab */}
            <TabsContent value="add-product">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">
                    {editingProductId ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  {editingProductId && (
                    <Button variant="outline" onClick={cancelEdit}>
                      Cancel Edit
                    </Button>
                  )}
                </div>
                
                <form onSubmit={handleProductSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name*</Label>
                      <Input
                        id="name"
                        name="name"
                        value={productFormData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        name="category"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={productFormData.category}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₹)*</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={productFormData.price || ''}
                        onChange={handleInputChange}
                        required
                        min="0"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="discountedPrice">Discounted Price (₹)</Label>
                      <Input
                        id="discountedPrice"
                        name="discountedPrice"
                        type="number"
                        value={productFormData.discountedPrice ?? ''}
                        onChange={handleInputChange}
                        min="0"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Description*</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={productFormData.description}
                        onChange={handleInputChange}
                        rows={4}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="images">Product Image URL*</Label>
                      <Input
                        id="images"
                        name="images"
                        value={productFormData.images[0]}
                        onChange={(e) => setProductFormData(prev => ({
                          ...prev,
                          images: [e.target.value]
                        }))}
                        required
                      />
                    </div>
                    
                    <div className="flex items-center space-x-6 pt-6">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="inStock"
                          name="inStock"
                          checked={productFormData.inStock}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="inStock">In Stock</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="featured"
                          name="featured"
                          checked={productFormData.featured}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="featured">Featured Product</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : editingProductId ? 'Update Product' : 'Add Product'}
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>
            
            {/* Orders Tab */}
            <TabsContent value="orders">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold mb-6">Orders</h2>
                
                {orders.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                    <p className="text-gray-500">
                      You haven't received any orders yet. Orders will appear here once customers place them.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center">
                              <span className="text-gray-500 mr-2">Order #{order.id.substring(0, 8).toUpperCase()}</span>
                              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                {new Date(order.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium 
                            ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : 
                              order.status === 'canceled' ? 'bg-red-100 text-red-800' : 
                              'bg-gray-100 text-gray-800'}`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {order.items.filter((item: any) => item.product.seller_id === user?.id).map((item: any) => (
                            <div key={item.id} className="flex items-start">
                              <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
                                <img 
                                  src={item.product.images[0]} 
                                  alt={item.product.name} 
                                  className="h-full w-full object-cover" 
                                />
                              </div>
                              <div className="ml-4 flex-1">
                                <p className="font-medium">{item.product.name}</p>
                                <div className="text-sm text-gray-500 mt-1">
                                  <span>Qty: {item.quantity}</span>
                                </div>
                                <p className="text-sm mt-1">{formatPrice(item.price)}</p>
                              </div>
                              <div className="text-right font-medium">
                                {formatPrice(item.price * item.quantity)}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                          <Button variant="outline" size="sm">Update Status</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default SellerDashboard;
