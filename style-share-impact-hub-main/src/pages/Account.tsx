import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, User, Heart, ShoppingBag, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/utils/currency';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled';
}

const Account = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.address || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      await updateProfile({
        name: profileForm.name,
        address: profileForm.address
      });
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      
      try {
        // Simulate fetching orders from a database
        const mockOrders: Order[] = [
          {
            id: '1',
            date: '2024-01-20',
            total: 1500,
            status: 'delivered',
            items: [
              { id: '101', name: 'T-Shirt', quantity: 2, price: 250, image: 'https://via.placeholder.com/50' },
              { id: '102', name: 'Jeans', quantity: 1, price: 1000, image: 'https://via.placeholder.com/50' },
            ],
          },
          {
            id: '2',
            date: '2023-12-15',
            total: 2200,
            status: 'shipped',
            items: [
              { id: '201', name: 'Shoes', quantity: 1, price: 1800, image: 'https://via.placeholder.com/50' },
              { id: '202', name: 'Socks', quantity: 4, price: 100, image: 'https://via.placeholder.com/50' },
            ],
          },
        ];
        
        setOrders(mockOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  const getUserInitials = () => {
    if (!user?.name) return '?';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">My Account</h1>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-16 w-16">
                    {user?.avatar_url ? (
                      <AvatarImage src={user.avatar_url} alt={user?.name || 'User'} />
                    ) : (
                      <AvatarFallback className="text-lg">{getUserInitials()}</AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-medium">{user?.name || 'User'}</h2>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                
                <nav className="space-y-1">
                  <Button variant="ghost" className="justify-start w-full" onClick={() => setActiveTab('profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button variant="ghost" className="justify-start w-full" onClick={() => setActiveTab('orders')}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Orders
                  </Button>
                  <Button variant="ghost" className="justify-start w-full" onClick={() => setActiveTab('donations')}>
                    <Heart className="mr-2 h-4 w-4" />
                    Donations
                  </Button>
                  {/* Add more navigation links as needed */}
                </nav>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="col-span-1 md:col-span-3">
              <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="donations">Donations</TabsTrigger>
                </TabsList>
                
                {/* Profile Tab */}
                <TabsContent value="profile">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                    
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          type="text"
                          id="name"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          type="email"
                          id="email"
                          value={profileForm.email}
                          readOnly
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          type="text"
                          id="address"
                          value={profileForm.address}
                          onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                        />
                      </div>
                      
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Updating...' : 'Update Profile'}
                      </Button>
                    </form>
                  </div>
                </TabsContent>
                
                {/* Orders Tab */}
                <TabsContent value="orders">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold mb-6">Order History</h2>
                    
                    {isLoading ? (
                      <p>Loading orders...</p>
                    ) : orders.length === 0 ? (
                      <p>No orders found.</p>
                    ) : (
                      <div className="space-y-4">
                        {orders.map(order => (
                          <Card key={order.id}>
                            <CardHeader>
                              <CardTitle>Order #{order.id}</CardTitle>
                              <CardDescription>
                                {new Date(order.date).toLocaleDateString()} - Total: {formatPrice(order.total)}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              {order.items.map(item => (
                                <div key={item.id} className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <img src={item.image} alt={item.name} className="h-8 w-8 rounded" />
                                    <div>
                                      <p className="font-medium">{item.name}</p>
                                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                    </div>
                                  </div>
                                  <div>{formatPrice(item.price * item.quantity)}</div>
                                </div>
                              ))}
                            </CardContent>
                            <CardFooter>
                              <p>Status: {order.status}</p>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                {/* Donations Tab */}
                <TabsContent value="donations">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold mb-6">Donations</h2>
                    <p>This section is under development. You will be able to view your donation history here soon.</p>
                  </div>
                </TabsContent>
                
              </Tabs>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Account;
