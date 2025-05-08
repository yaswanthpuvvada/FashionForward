import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCategories } from '@/hooks/useCategories';
import { toast } from 'sonner';
import { formatPrice } from '@/utils/currency';

interface Product {
  id: string;
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
  categories: {
    name: string;
  } | null;
}

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { categories } = useCategories();
  
  // Get initial category from URL params and fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, categories:category_id (name)')
          .eq('in_stock', true);
        
        if (error) {
          throw error;
        }
        
        setProducts(data as Product[]);
        
        // Find the highest price for the range slider
        if (data && data.length > 0) {
          const highest = Math.max(...data.map(p => p.price));
          setMaxPrice(highest);
          setPriceRange([0, highest]);
        }
        
        // Get category from URL params
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
          const categoryId = categories.find(c => 
            c.name.toLowerCase() === categoryParam.toLowerCase()
          )?.id;
          
          if (categoryId) {
            setCategoryFilters([categoryId]);
          }
        }
      } catch (error: any) {
        toast.error(`Error loading products: ${error.message}`);
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [searchParams]);

  // Apply filters
  useEffect(() => {
    let results = [...products];
    
    // Apply category filters
    if (categoryFilters.length > 0) {
      results = results.filter(product => 
        categoryFilters.includes(product.category_id)
      );
    }
    
    // Apply price filter
    results = results.filter(product => {
      const price = product.discounted_price || product.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        results.sort((a, b) => {
          const priceA = a.discounted_price || a.price;
          const priceB = b.discounted_price || b.price;
          return priceA - priceB;
        });
        break;
      case 'price-desc':
        results.sort((a, b) => {
          const priceA = a.discounted_price || a.price;
          const priceB = b.discounted_price || b.price;
          return priceB - priceA;
        });
        break;
      case 'newest':
        results.sort((a, b) => 
          new Date(b.date_added).getTime() - new Date(a.date_added).getTime()
        );
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Featured or default
        results = results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    
    setFilteredProducts(results);
  }, [categoryFilters, priceRange, sortBy, products]);

  const toggleCategoryFilter = (categoryId: string) => {
    setCategoryFilters(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
  };

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  const clearAllFilters = () => {
    setCategoryFilters([]);
    setPriceRange([0, maxPrice]);
    setSortBy('featured');
  };
  
  const handleAddToCart = (productId: string) => {
    // TODO: Implement cart functionality
    toast.success("Added to cart!");
  };
  
  const handleAddToWishlist = (productId: string) => {
    // TODO: Implement wishlist functionality
    toast.success("Added to wishlist!");
  };
  
  // Convert the products to format expected by ProductCard
  const productCards = filteredProducts.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    discountedPrice: product.discounted_price,
    category: product.categories?.name || '',
    rating: product.rating,
    reviews: product.reviews,
    featured: product.featured,
    inStock: product.in_stock,
    images: product.images
  }));
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden mb-4">
            <Button 
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              variant="outline"
              className="w-full flex justify-between items-center"
            >
              <span className="flex items-center">
                <Filter className="mr-2 h-4 w-4" /> Filters
              </span>
              {isMobileFilterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
          
          {/* Sidebar Filters */}
          <aside 
            className={`w-full md:w-64 flex-shrink-0 ${isMobileFilterOpen ? 'block' : 'hidden'} md:block`}
          >
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold">Filters</h2>
                <button 
                  className="text-sm text-primary-600 hover:text-primary-800"
                  onClick={clearAllFilters}
                >
                  Clear All
                </button>
              </div>
              
              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category.id} className="flex items-center">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={categoryFilters.includes(category.id)}
                        onCheckedChange={() => toggleCategoryFilter(category.id)}
                      />
                      <label 
                        htmlFor={`category-${category.id}`}
                        className="ml-2 text-sm cursor-pointer"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Price Range</h3>
                <Slider
                  value={priceRange}
                  min={0}
                  max={maxPrice}
                  step={100}
                  onValueChange={handlePriceChange}
                  className="mb-4"
                />
                <div className="flex justify-between">
                  <span className="text-sm">{formatPrice(priceRange[0])}</span>
                  <span className="text-sm">{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </div>
          </aside>
          
          {/* Product Grid */}
          <div className="flex-grow">
            {/* Sort Controls */}
            <div className="flex flex-wrap items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">
                All Products
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filteredProducts.length} items)
                </span>
              </h1>
              
              <div className="flex items-center">
                <label htmlFor="sort" className="mr-2 text-sm">Sort by:</label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={handleSortChange}
                  className="border border-gray-300 rounded p-2 text-sm"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
            
            {/* Products */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productCards.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    onAddToWishlist={handleAddToWishlist}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters</p>
                <Button 
                  className="mt-4"
                  variant="outline"
                  onClick={() => {
                    setCategoryFilters([]);
                    setPriceRange([0, maxPrice]);
                    setSortBy('featured');
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
