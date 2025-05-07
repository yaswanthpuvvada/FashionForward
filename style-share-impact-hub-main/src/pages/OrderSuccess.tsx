
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { CheckCheck } from 'lucide-react';
import { formatPrice } from '@/utils/currency';
import { supabase } from '@/integrations/supabase/client';

const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const orderId = location.state?.orderId;
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      
      try {
        // Fetch order details
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();
        
        if (orderError) throw orderError;
        
        // Fetch order items
        const { data: orderItems, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            *,
            product:products(id, name, images)
          `)
          .eq('order_id', orderId);
        
        if (itemsError) throw itemsError;
        
        setOrderDetails({
          ...order,
          items: orderItems
        });
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId]);
  
  // Redirect to home if no order ID is provided
  useEffect(() => {
    if (!loading && !orderId) {
      navigate('/');
    }
  }, [loading, orderId, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white rounded-lg border p-8 text-center">
          <div className="bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <CheckCheck className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We've received your purchase request.
          </p>
          
          {orderDetails && (
            <div className="text-left border-t border-gray-200 pt-6 mt-6">
              <div className="flex justify-between mb-4">
                <div>
                  <h2 className="font-semibold">Order #</h2>
                  <p className="text-gray-700">{orderDetails.id.substring(0, 8).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <h2 className="font-semibold">Date</h2>
                  <p className="text-gray-700">
                    {new Date(orderDetails.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <h2 className="font-semibold">Order Items</h2>
                {orderDetails.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                      <div className="ml-3">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <p>Total</p>
                  <p>{formatPrice(orderDetails.total_price)}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 space-x-4">
            <Button onClick={() => navigate('/shop')}>
              Continue Shopping
            </Button>
            <Button variant="outline" onClick={() => navigate('/account')}>
              View My Orders
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderSuccessPage;
