
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart } from 'lucide-react';
import { formatPrice } from '@/utils/currency';
import { useCart } from '@/contexts/CartContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number | null;
  category: string;
  rating: number;
  reviews: number;
  featured?: boolean;
  inStock?: boolean;
  images: string[];
}

interface ProductCardProps {
  product: Product;
  onAddToWishlist?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToWishlist 
}) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart(product, 1);
  };
  
  const handleAddToWishlist = () => {
    if (onAddToWishlist) {
      onAddToWishlist(product.id);
    }
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="h-60 w-full object-cover"
        />
        {product.featured && (
          <span className="absolute top-2 left-2 bg-primary px-2 py-1 text-xs text-white rounded">
            Featured
          </span>
        )}
        {product.discountedPrice && (
          <span className="absolute top-2 right-2 bg-red-500 px-2 py-1 text-xs text-white rounded">
            Sale
          </span>
        )}
        <button 
          onClick={handleAddToWishlist}
          className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow-sm hover:shadow-md transition-shadow"
        >
          <Heart className="h-5 w-5 text-gray-500 hover:text-red-500" />
        </button>
      </div>
      
      <CardContent className="pt-4">
        <div className="mb-2">
          <p className="text-xs text-gray-500 uppercase">{product.category}</p>
        </div>
        <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
        <div className="flex justify-between items-center mt-1">
          <div>
            {product.discountedPrice ? (
              <div className="flex items-center gap-2">
                <span className="font-bold">{formatPrice(product.discountedPrice)}</span>
                <span className="text-gray-500 line-through text-sm">{formatPrice(product.price)}</span>
              </div>
            ) : (
              <span className="font-bold">{formatPrice(product.price)}</span>
            )}
          </div>
          <div className="flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="ml-1 text-sm">{product.rating}</span>
            <span className="ml-1 text-xs text-gray-500">({product.reviews})</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          className="w-full"
          onClick={handleAddToCart}
          disabled={product.inStock === false}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.inStock === false ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
