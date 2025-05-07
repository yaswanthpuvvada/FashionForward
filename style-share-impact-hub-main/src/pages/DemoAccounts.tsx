
// Create a page to display demo accounts and populate sample data
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createDemoData } from '@/utils/demoData';
import { toast } from 'sonner';
import { UserCircle2, Users, Store, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DemoAccounts = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleCreateDemoData = async () => {
    setIsLoading(true);
    try {
      const result = await createDemoData();
      if (result.success) {
        toast.success('Demo data created successfully!');
      } else {
        toast.error('Failed to create demo data');
      }
    } catch (error) {
      console.error('Error creating demo data:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLoginAs = async (email: string, password: string, role: 'customer' | 'seller' | 'ngo') => {
    try {
      await login(email, password, role);
      
      // Redirect based on role
      switch (role) {
        case 'seller':
          navigate('/seller-dashboard');
          break;
        case 'ngo':
          navigate('/ngo-dashboard');
          break;
        default:
          navigate('/');
      }
      
      toast.success(`Logged in as ${role}`);
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Demo Accounts</h1>
            <p className="text-gray-600">
              Use these demo accounts to test different features of the application.
              Each account comes with pre-populated data for a complete experience.
            </p>
            
            <Button 
              onClick={handleCreateDemoData}
              className="mt-4" 
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Demo Data'}
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Customer Account */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-center mb-2">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="https://i.pravatar.cc/150?u=customer" />
                    <AvatarFallback>
                      <UserCircle2 className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-center">Customer Account</CardTitle>
                <CardDescription className="text-center">
                  Browse products, make donations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium">customer@example.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Password:</span>
                    <span className="font-medium">password123</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleLoginAs('customer@example.com', 'password123', 'customer')}
                >
                  Login as Customer
                </Button>
              </CardFooter>
            </Card>
            
            {/* Seller Account */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-center mb-2">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="https://i.pravatar.cc/150?u=seller" />
                    <AvatarFallback>
                      <Store className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-center">Seller Account</CardTitle>
                <CardDescription className="text-center">
                  Manage products and orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium">seller@example.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Password:</span>
                    <span className="font-medium">password123</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleLoginAs('seller@example.com', 'password123', 'seller')}
                >
                  Login as Seller
                </Button>
              </CardFooter>
            </Card>
            
            {/* NGO Account */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-center mb-2">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="https://i.pravatar.cc/150?u=ngo" />
                    <AvatarFallback>
                      <Heart className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-center">NGO Account</CardTitle>
                <CardDescription className="text-center">
                  Accept donations, create requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium">ngo@example.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Password:</span>
                    <span className="font-medium">password123</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleLoginAs('ngo@example.com', 'password123', 'ngo')}
                >
                  Login as NGO
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium mb-4">Features Available</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-2">Customer</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  <li>Browse and purchase products</li>
                  <li>View order history</li>
                  <li>Make clothing donations</li>
                  <li>Manage profile</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Seller</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  <li>Add and edit products</li>
                  <li>View and manage inventory</li>
                  <li>Process orders</li>
                  <li>View sales analytics</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">NGO</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  <li>Create clothing requests</li>
                  <li>View and accept donations</li>
                  <li>Track donation status</li>
                  <li>Manage requests</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DemoAccounts;
