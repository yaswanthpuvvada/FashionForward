
// Create a utility to populate demo accounts and sample data
import { supabase } from '@/integrations/supabase/client';

// Demo users
const demoUsers = [
  {
    email: 'customer@example.com',
    password: 'password123',
    role: 'customer',
    name: 'Demo Customer',
    avatar_url: 'https://i.pravatar.cc/150?u=customer'
  },
  {
    email: 'seller@example.com',
    password: 'password123',
    role: 'seller',
    name: 'Demo Seller',
    avatar_url: 'https://i.pravatar.cc/150?u=seller'
  },
  {
    email: 'ngo@example.com',
    password: 'password123',
    role: 'ngo',
    name: 'Demo NGO',
    avatar_url: 'https://i.pravatar.cc/150?u=ngo'
  }
];

// Sample products
const sampleProducts = [
  {
    name: 'Classic White T-Shirt',
    description: 'A comfortable and versatile white t-shirt made from 100% organic cotton.',
    price: 799,
    discounted_price: 599,
    category_id: '', // Will be set dynamically
    in_stock: true,
    featured: true,
    rating: 4.5,
    reviews: 120,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
  },
  {
    name: 'Blue Denim Jeans',
    description: 'Classic blue jeans with a comfortable fit and durable construction.',
    price: 1499,
    discounted_price: null,
    category_id: '', // Will be set dynamically
    in_stock: true,
    featured: false,
    rating: 4.2,
    reviews: 85,
    images: ['https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
  },
  {
    name: 'Summer Floral Dress',
    description: 'A light and airy floral dress perfect for summer occasions.',
    price: 1999,
    discounted_price: 1499,
    category_id: '', // Will be set dynamically
    in_stock: true,
    featured: true,
    rating: 4.8,
    reviews: 65,
    images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
  },
  {
    name: 'Wool Winter Coat',
    description: 'A warm wool coat that will keep you comfortable all winter long.',
    price: 3999,
    discounted_price: null,
    category_id: '', // Will be set dynamically
    in_stock: true,
    featured: false,
    rating: 4.6,
    reviews: 42,
    images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
  },
  {
    name: 'Leather Sneakers',
    description: 'Premium leather sneakers that combine style and comfort.',
    price: 2499,
    discounted_price: 1999,
    category_id: '', // Will be set dynamically
    in_stock: true,
    featured: true,
    rating: 4.4,
    reviews: 96,
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
  }
];

// Sample donations
const sampleDonations = [
  {
    title: 'Winter Clothing Bundle',
    description: 'A bundle of gently used winter clothing including jackets, sweaters, and scarves.',
    category_id: '', // Will be set dynamically
    condition: 'good',
    gender: 'unisex',
    size: 'mixed',
    location: 'Mumbai',
    images: ['https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3']
  },
  {
    title: 'Children\'s School Uniforms',
    description: 'Lightly used school uniforms for children ages 7-10.',
    category_id: '', // Will be set dynamically
    condition: 'excellent',
    gender: 'children',
    size: 'medium',
    location: 'Delhi',
    images: ['https://images.unsplash.com/photo-1543269664-76bc3997d9ea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3']
  }
];

// Sample NGO requests
const sampleRequests = [
  {
    title: 'Monsoon Relief Clothing Drive',
    description: 'We are collecting waterproof clothing and footwear for communities affected by flooding.',
    items: [
      {
        category_id: '', // Will be set dynamically
        quantity: 50,
        gender: 'unisex',
        urgency: 'high'
      },
      {
        category_id: '', // Will be set dynamically
        quantity: 100,
        gender: 'children',
        urgency: 'critical'
      }
    ]
  },
  {
    title: 'Winter Essentials Collection',
    description: 'Collecting warm clothing for homeless shelters in preparation for winter.',
    items: [
      {
        category_id: '', // Will be set dynamically
        quantity: 30,
        gender: 'men',
        urgency: 'medium'
      },
      {
        category_id: '', // Will be set dynamically
        quantity: 30,
        gender: 'women',
        urgency: 'medium'
      }
    ]
  }
];

// Create demo accounts and sample data
export const createDemoData = async () => {
  try {
    console.log('Starting demo data creation...');
    
    // Get categories to use for references
    const { data: categories } = await supabase
      .from('categories')
      .select('id, name');
      
    if (!categories || categories.length === 0) {
      throw new Error('Categories not found');
    }
    
    // Find categories by name
    const findCategoryId = (name: string) => {
      const category = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
      return category ? category.id : categories[0].id;
    };
    
    // Assign category IDs
    sampleProducts[0].category_id = findCategoryId('tops');
    sampleProducts[1].category_id = findCategoryId('bottoms');
    sampleProducts[2].category_id = findCategoryId('dresses');
    sampleProducts[3].category_id = findCategoryId('outerwear');
    sampleProducts[4].category_id = findCategoryId('footwear');
    
    sampleDonations[0].category_id = findCategoryId('outerwear');
    sampleDonations[1].category_id = findCategoryId('tops');
    
    sampleRequests[0].items[0].category_id = findCategoryId('outerwear');
    sampleRequests[0].items[1].category_id = findCategoryId('footwear');
    sampleRequests[1].items[0].category_id = findCategoryId('outerwear');
    sampleRequests[1].items[1].category_id = findCategoryId('accessories');
    
    // Create/get demo users
    let createdUsers = [];
    
    for (const user of demoUsers) {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', user.email)
        .single();
        
      if (existingUser) {
        console.log(`User ${user.email} already exists, skipping creation`);
        createdUsers.push({
          ...user,
          id: existingUser.id
        });
        continue;
      }
      
      // Create new user
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
      });
      
      if (authError) {
        console.error(`Error creating user ${user.email}:`, authError);
        continue;
      }
      
      // Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: user.name,
          role: user.role,
          avatar_url: user.avatar_url
        })
        .eq('id', authUser.user!.id);
        
      if (profileError) {
        console.error(`Error updating profile for ${user.email}:`, profileError);
      }
      
      createdUsers.push({
        ...user,
        id: authUser.user!.id
      });
      
      console.log(`Created user: ${user.email} with role ${user.role}`);
    }
    
    // Create products from the seller
    const seller = createdUsers.find(u => u.role === 'seller');
    if (seller) {
      // Check if seller already has products
      const { data: existingProducts } = await supabase
        .from('products')
        .select('id')
        .eq('seller_id', seller.id);
        
      if (!existingProducts || existingProducts.length === 0) {
        // Create products
        for (const product of sampleProducts) {
          const { error } = await supabase
            .from('products')
            .insert({
              ...product,
              seller_id: seller.id
            });
            
          if (error) {
            console.error(`Error creating product ${product.name}:`, error);
          } else {
            console.log(`Created product: ${product.name}`);
          }
        }
      } else {
        console.log(`Seller already has ${existingProducts.length} products, skipping product creation`);
      }
    }
    
    // Create donations from the customer
    const customer = createdUsers.find(u => u.role === 'customer');
    if (customer) {
      // Check if customer already has donations
      const { data: existingDonations } = await supabase
        .from('donations')
        .select('id')
        .eq('donor_id', customer.id);
        
      if (!existingDonations || existingDonations.length === 0) {
        // Create donations
        for (const donation of sampleDonations) {
          const { error } = await supabase
            .from('donations')
            .insert({
              ...donation,
              donor_id: customer.id
            });
            
          if (error) {
            console.error(`Error creating donation ${donation.title}:`, error);
          } else {
            console.log(`Created donation: ${donation.title}`);
          }
        }
      } else {
        console.log(`Customer already has ${existingDonations.length} donations, skipping donation creation`);
      }
    }
    
    // Create requests from the NGO
    const ngo = createdUsers.find(u => u.role === 'ngo');
    if (ngo) {
      // Check if NGO already has requests
      const { data: existingRequests } = await supabase
        .from('requests')
        .select('id')
        .eq('requester_id', ngo.id);
        
      if (!existingRequests || existingRequests.length === 0) {
        // Create requests
        for (const request of sampleRequests) {
          const { data: newRequest, error } = await supabase
            .from('requests')
            .insert({
              title: request.title,
              description: request.description,
              requester_id: ngo.id
            })
            .select()
            .single();
            
          if (error) {
            console.error(`Error creating request ${request.title}:`, error);
            continue;
          }
          
          // Create request items
          for (const item of request.items) {
            const { error: itemError } = await supabase
              .from('request_items')
              .insert({
                ...item,
                request_id: newRequest.id
              });
              
            if (itemError) {
              console.error(`Error creating request item for ${request.title}:`, itemError);
            }
          }
          
          console.log(`Created request: ${request.title} with ${request.items.length} items`);
        }
      } else {
        console.log(`NGO already has ${existingRequests.length} requests, skipping request creation`);
      }
    }
    
    return {
      success: true,
      users: demoUsers
    };
  } catch (error) {
    console.error('Error creating demo data:', error);
    return {
      success: false,
      error
    };
  }
};
