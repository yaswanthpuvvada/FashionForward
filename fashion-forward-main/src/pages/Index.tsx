
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { MOCK_PRODUCTS, CATEGORIES } from '@/data/mockData';
import { ArrowRight, Heart, Package, TrendingUp, UserCheck } from 'lucide-react';

const Index = () => {
  const featuredProducts = MOCK_PRODUCTS.filter(product => product.featured);
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-100 to-secondary-500">
        <div className="container mx-auto px-4 py-24 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-5xl font-bold leading-tight text-gray-900">
              Sustainable Fashion for a Better Tomorrow
            </h1>
            <p className="text-xl text-gray-700">
              Shop, Sell, and Donate with FashionForward - where style meets social impact.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" asChild>
                <Link to="/shop">Shop Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/donate">Donate Clothes</Link>
              </Button>
            </div>
          </div>
          
          <div className="md:w-1/2 relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                alt="Sustainable Fashion" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-lg p-4 shadow-lg max-w-[200px]">
              <p className="font-semibold text-primary-700">
                1000+ clothes donated this month!
              </p>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How FashionForward Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're bringing together shoppers, sellers, and NGOs to create a sustainable fashion ecosystem.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-primary-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Shop with Purpose</h3>
              <p className="text-gray-600">
                Browse and buy quality clothing from sustainable sellers, knowing each purchase makes a difference.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sell Your Products</h3>
              <p className="text-gray-600">
                Become a seller and showcase your sustainable fashion items to conscious consumers.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Donate Clothes</h3>
              <p className="text-gray-600">
                Give your clothes a second life by donating them to NGOs and those in need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link to="/shop" className="text-primary-600 hover:text-primary-800 font-medium flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.slice(0, 8).map(category => (
              <Link 
                key={category.id} 
                to={`/shop?category=${category.id}`}
                className="group relative aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all z-10"></div>
                <img 
                  src={`https://source.unsplash.com/300x300/?fashion,${category.name.toLowerCase()}`} 
                  alt={category.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <h3 className="text-white text-xl font-bold tracking-wide drop-shadow-lg">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Donation CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Make a Difference by Donating</h2>
              <p className="text-xl mb-6 text-primary-100">
                Your gently used clothing can change lives. Donate to NGOs and help those in need while reducing waste.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/donate">Donate Now</Link>
              </Button>
            </div>
            
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="font-bold text-2xl">1,200+</h3>
                <p>Donations Made</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="font-bold text-2xl">20+</h3>
                <p>NGO Partners</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="font-bold text-2xl">5,000+</h3>
                <p>Items Donated</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="font-bold text-2xl">50+</h3>
                <p>Open Requests</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Community Says</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of happy customers, sellers and NGOs making a difference with FashionForward.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <img 
                    src="https://i.pravatar.cc/100?img=1" 
                    alt="User testimonial" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Sarah K.</h4>
                  <p className="text-sm text-gray-500">Customer</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "I love shopping on FashionForward! The quality of clothing is amazing, and I feel good knowing my purchases support sustainable fashion."
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <img 
                    src="https://i.pravatar.cc/100?img=11" 
                    alt="User testimonial" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Mark J.</h4>
                  <p className="text-sm text-gray-500">Seller</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As a sustainable clothing seller, FashionForward has given me a platform to reach customers who truly value ethical fashion."
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <img 
                    src="https://i.pravatar.cc/100?img=6" 
                    alt="User testimonial" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Priya M.</h4>
                  <p className="text-sm text-gray-500">NGO Partner</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The donation platform has been a game-changer for our organization. We're now able to receive quality clothing donations directly from the community."
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
