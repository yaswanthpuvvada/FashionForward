
// Fix TypeScript errors in useRequests.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type RequestStatus = 'open' | 'in-progress' | 'fulfilled' | 'closed';

export interface RequestItem {
  category_id: string;
  quantity: number;
  gender: 'men' | 'women' | 'children' | 'unisex';
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface Request {
  id: string;
  requester_id: string;
  title: string;
  description: string;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
  items?: any[]; // Add optional items property
}

export interface RequestWithDetails extends Request {
  items: {
    id: string;
    request_id: string;
    category_id: string;
    quantity: number;
    gender: string;
    urgency: string;
    created_at: string;
  }[];
  profiles: {
    name: string | null;
  } | null; // Make profiles nullable to handle error cases
}

interface UseRequestsReturn {
  requests: RequestWithDetails[];
  loading: boolean;
  error: string | null;
  addRequest: (request: { title: string, description: string, items: RequestItem[] }) => Promise<boolean>;
  updateRequestStatus: (requestId: string, status: RequestStatus) => Promise<boolean>;
  fetchRequests: () => Promise<void>;
}

export const useRequests = (userId?: string): UseRequestsReturn => {
  const [requests, setRequests] = useState<RequestWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchRequests = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all requests for the NGO user
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          profiles (name)
        `)
        .eq('requester_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (!data) {
        setRequests([]);
        return;
      }
      
      // For each request, fetch its items
      const requestsWithItems: RequestWithDetails[] = await Promise.all(
        data.map(async (req) => {
          const { data: items, error: itemsError } = await supabase
            .from('request_items')
            .select('*')
            .eq('request_id', req.id);
          
          if (itemsError) throw itemsError;
          
          // Handle potential error with profiles - safely access properties with null checks
          const profileName = req.profiles && 
                             typeof req.profiles === 'object' && 
                             'name' in req.profiles ? 
                             req.profiles.name || 'Unknown' : 
                             'Unknown';
          
          const profilesData = { name: profileName };
          
          return {
            ...req,
            // Ensure status is cast to RequestStatus type
            status: req.status as RequestStatus,
            items: items || [],
            profiles: profilesData
          } as RequestWithDetails;
        })
      );
      
      setRequests(requestsWithItems);
    } catch (err: any) {
      console.error('Error fetching requests:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRequests();
  }, [userId]);
  
  const addRequest = async (request: { title: string, description: string, items: RequestItem[] }): Promise<boolean> => {
    if (!userId) {
      toast.error('You must be logged in to create a request');
      return false;
    }
    
    try {
      // First, insert the request
      const { data: newRequest, error: requestError } = await supabase
        .from('requests')
        .insert({
          requester_id: userId,
          title: request.title,
          description: request.description
        })
        .select()
        .single();
      
      if (requestError) throw requestError;
      
      // Then, insert all items
      const items = request.items.map(item => ({
        ...item,
        request_id: newRequest.id
      }));
      
      const { error: itemsError } = await supabase
        .from('request_items')
        .insert(items);
      
      if (itemsError) throw itemsError;
      
      // Fetch the newly created request with its items
      const { data: items2, error: fetchItemsError } = await supabase
        .from('request_items')
        .select('*')
        .eq('request_id', newRequest.id);
      
      if (fetchItemsError) throw fetchItemsError;
      
      // Update local state with properly typed data
      const newRequestWithDetails: RequestWithDetails = {
        ...newRequest,
        // Ensure status is properly typed as RequestStatus
        status: newRequest.status as RequestStatus,
        items: items2 || [],
        profiles: {
          name: 'Me' // This will be replaced with the actual name on next fetch
        }
      };
      
      setRequests(prev => [newRequestWithDetails, ...prev]);
      
      toast.success('Request created successfully');
      return true;
    } catch (err: any) {
      console.error('Error creating request:', err);
      toast.error(err.message);
      return false;
    }
  };
  
  const updateRequestStatus = async (requestId: string, status: RequestStatus): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('requests')
        .update({ status })
        .eq('id', requestId);
      
      if (error) throw error;
      
      // Update local state
      setRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status } 
            : request
        )
      );
      
      toast.success(`Request ${status.replace('-', ' ')}`);
      return true;
    } catch (err: any) {
      console.error('Error updating request status:', err);
      toast.error(err.message);
      return false;
    }
  };
  
  return {
    requests,
    loading,
    error,
    addRequest,
    updateRequestStatus,
    fetchRequests
  };
};
