
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  sellerId: string;
  sellerName: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  sizes?: string[];
  colors?: string[];
  tags: string[];
  featured?: boolean;
  dateAdded: Date;
}

export interface Order {
  id: string;
  customerId: string;
  products: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
    size?: string;
    color?: string;
  }[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled' | 'returned';
  totalPrice: number;
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
  trackingNumber?: string;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  items: {
    id: string;
    name: string;
    description: string;
    condition: 'new' | 'like new' | 'good' | 'fair' | 'poor';
    images: string[];
    category: string;
    size?: string;
  }[];
  status: 'pending' | 'accepted' | 'picked up' | 'completed' | 'rejected';
  pickupAddress?: Address;
  ngoId?: string;
  ngoName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Request {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterType: 'ngo' | 'individual';
  title: string;
  description: string;
  items: {
    category: string;
    quantity: number;
    sizes?: string[];
    gender?: 'men' | 'women' | 'children' | 'unisex';
    urgency: 'low' | 'medium' | 'high' | 'critical';
  }[];
  status: 'open' | 'in-progress' | 'fulfilled' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Classic White T-Shirt',
    description: 'A comfortable white t-shirt made from 100% organic cotton. Perfect for everyday wear.',
    price: 24.99,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
    category: 'tops',
    subcategory: 't-shirts',
    sellerId: '2',
    sellerName: 'Eco Apparel',
    rating: 4.5,
    reviews: 128,
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['white', 'black', 'gray'],
    tags: ['casual', 'basics', 'cotton'],
    featured: true,
    dateAdded: new Date('2023-01-15')
  },
  {
    id: 'p2',
    name: 'Slim Fit Jeans',
    description: 'Modern slim fit jeans with a comfortable stretch. Made using sustainable denim techniques.',
    price: 59.99,
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
    category: 'bottoms',
    subcategory: 'jeans',
    sellerId: '2',
    sellerName: 'Eco Apparel',
    rating: 4.2,
    reviews: 95,
    inStock: true,
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['blue', 'black', 'gray'],
    tags: ['casual', 'denim', 'sustainable'],
    dateAdded: new Date('2023-02-10')
  },
  {
    id: 'p3',
    name: 'Summer Floral Dress',
    description: 'Light and flowy summer dress with a beautiful floral pattern. Perfect for warm days.',
    price: 49.99,
    discountedPrice: 39.99,
    images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
    category: 'dresses',
    sellerId: '2',
    sellerName: 'Style Forward',
    rating: 4.8,
    reviews: 73,
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L'],
    tags: ['summer', 'floral', 'casual', 'feminine'],
    featured: true,
    dateAdded: new Date('2023-03-05')
  },
  {
    id: 'p4',
    name: 'Tailored Blazer',
    description: 'Professional blazer with modern cut and sustainable materials. Perfect for office wear.',
    price: 129.99,
    images: ['https://images.unsplash.com/photo-1548778943-5bbeeb1ba6f1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
    category: 'outerwear',
    subcategory: 'blazers',
    sellerId: '2',
    sellerName: 'Premium Fashion',
    rating: 4.6,
    reviews: 42,
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['navy', 'black', 'gray'],
    tags: ['formal', 'business', 'professional'],
    dateAdded: new Date('2023-01-25')
  },
  {
    id: 'p5',
    name: 'Casual Sneakers',
    description: 'Comfortable sneakers made with recycled materials. Great for all-day wear.',
    price: 79.99,
    discountedPrice: 59.99,
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
    category: 'shoes',
    subcategory: 'sneakers',
    sellerId: '2',
    sellerName: 'Eco Footwear',
    rating: 4.3,
    reviews: 136,
    inStock: true,
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['white', 'black', 'green'],
    tags: ['casual', 'sustainable', 'comfortable'],
    featured: true,
    dateAdded: new Date('2023-02-05')
  },
  {
    id: 'p6',
    name: 'Recycled Wool Sweater',
    description: 'Warm and cozy sweater made from recycled wool. Ethically produced.',
    price: 84.99,
    images: ['https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
    category: 'tops',
    subcategory: 'sweaters',
    sellerId: '2',
    sellerName: 'Eco Apparel',
    rating: 4.7,
    reviews: 58,
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['cream', 'navy', 'burgundy'],
    tags: ['winter', 'warm', 'sustainable', 'recycled'],
    dateAdded: new Date('2023-03-15')
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    customerId: '1',
    products: [
      {
        productId: 'p1',
        name: 'Classic White T-Shirt',
        quantity: 2,
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        size: 'M',
        color: 'white'
      },
      {
        productId: 'p2',
        name: 'Slim Fit Jeans',
        quantity: 1,
        price: 59.99,
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        size: '32',
        color: 'blue'
      }
    ],
    status: 'delivered',
    totalPrice: 109.97,
    shippingAddress: {
      fullName: 'John Customer',
      line1: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA',
      phone: '555-123-4567'
    },
    paymentMethod: 'Credit Card',
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-03-15'),
    trackingNumber: 'TRK123456789'
  },
  {
    id: 'o2',
    customerId: '1',
    products: [
      {
        productId: 'p3',
        name: 'Summer Floral Dress',
        quantity: 1,
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        size: 'S'
      }
    ],
    status: 'shipped',
    totalPrice: 39.99,
    shippingAddress: {
      fullName: 'John Customer',
      line1: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA',
      phone: '555-123-4567'
    },
    paymentMethod: 'PayPal',
    createdAt: new Date('2023-04-05'),
    updatedAt: new Date('2023-04-07'),
    trackingNumber: 'TRK987654321'
  }
];

export const MOCK_DONATIONS: Donation[] = [
  {
    id: 'd1',
    donorId: '1',
    donorName: 'John Customer',
    items: [
      {
        id: 'di1',
        name: 'Winter Coat',
        description: 'Barely used winter coat, very warm.',
        condition: 'good',
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
        category: 'outerwear',
        size: 'L'
      },
      {
        id: 'di2',
        name: 'Men\'s Shirts Bundle',
        description: 'Set of 5 casual shirts in good condition',
        condition: 'good',
        images: ['https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
        category: 'tops',
        size: 'M'
      }
    ],
    status: 'pending',
    pickupAddress: {
      fullName: 'John Customer',
      line1: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA',
      phone: '555-123-4567'
    },
    createdAt: new Date('2023-04-10'),
    updatedAt: new Date('2023-04-10')
  },
  {
    id: 'd2',
    donorId: '1',
    donorName: 'John Customer',
    items: [
      {
        id: 'di3',
        name: 'Children\'s Clothing Bundle',
        description: 'Like new children\'s clothing, ages 3-5',
        condition: 'like new',
        images: ['https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
        category: 'children',
        size: '3-5y'
      }
    ],
    status: 'accepted',
    pickupAddress: {
      fullName: 'John Customer',
      line1: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA',
      phone: '555-123-4567'
    },
    ngoId: '3',
    ngoName: 'Eco NGO',
    createdAt: new Date('2023-03-15'),
    updatedAt: new Date('2023-03-17')
  }
];

export const MOCK_REQUESTS: Request[] = [
  {
    id: 'r1',
    requesterId: '3',
    requesterName: 'Eco NGO',
    requesterType: 'ngo',
    title: 'Winter Clothing Drive',
    description: 'Looking for winter clothing for homeless shelter residents. Warm coats, sweaters, and thermal wear needed.',
    items: [
      {
        category: 'outerwear',
        quantity: 50,
        gender: 'unisex',
        urgency: 'high'
      },
      {
        category: 'tops',
        quantity: 100,
        gender: 'unisex',
        urgency: 'medium'
      }
    ],
    status: 'open',
    createdAt: new Date('2023-04-01'),
    updatedAt: new Date('2023-04-01')
  },
  {
    id: 'r2',
    requesterId: '3',
    requesterName: 'Eco NGO',
    requesterType: 'ngo',
    title: 'Children\'s Clothing for School Program',
    description: 'Need children\'s clothing for back-to-school program serving underprivileged communities.',
    items: [
      {
        category: 'children',
        quantity: 75,
        sizes: ['3-5y', '6-8y', '9-12y'],
        gender: 'unisex',
        urgency: 'medium'
      }
    ],
    status: 'open',
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2023-03-20')
  }
];

export const CATEGORIES = [
  { id: 'tops', name: 'Tops', subcategories: ['t-shirts', 'shirts', 'sweaters', 'blouses'] },
  { id: 'bottoms', name: 'Bottoms', subcategories: ['jeans', 'skirts', 'shorts', 'pants'] },
  { id: 'dresses', name: 'Dresses' },
  { id: 'outerwear', name: 'Outerwear', subcategories: ['jackets', 'coats', 'blazers'] },
  { id: 'shoes', name: 'Shoes', subcategories: ['sneakers', 'boots', 'heels', 'sandals'] },
  { id: 'accessories', name: 'Accessories', subcategories: ['hats', 'bags', 'jewelry', 'scarves'] },
  { id: 'children', name: 'Children' },
  { id: 'sports', name: 'Sports & Active Wear' }
];
