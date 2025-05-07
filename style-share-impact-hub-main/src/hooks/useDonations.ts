// Fix TypeScript errors in useDonations.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Donation {
  id: string;
  donor_id: string;
  ngo_id: string | null;
  title: string;
  description: string;
  category_id: string | null;
  condition: string;
  gender: string | null;
  size: string | null;
  location: string | null;
  images: string[];
  status: 'pending' | 'accepted' | 'completed' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface DonationWithDetails extends Donation {
  categories: {
    name: string;
  } | null;
  profiles: {
    name: string | null;
    avatar_url: string | null;
  } | null; // Make profiles nullable to handle error cases
}

interface UseDonationsReturn {
  pendingDonations: DonationWithDetails[];
  donations: DonationWithDetails[];
  loading: boolean;
  error: string | null;
  addDonation: (donation: Omit<Donation, 'id' | 'donor_id' | 'ngo_id' | 'status' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  acceptDonation: (donationId: string) => Promise<boolean>;
  completeDonation: (donationId: string) => Promise<boolean>;
  fetchDonations: () => Promise<void>;
}

export const useDonations = (userId?: string): UseDonationsReturn => {
  const [pendingDonations, setPendingDonations] = useState<DonationWithDetails[]>([]);
  const [donations, setDonations] = useState<DonationWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchDonations = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch pending donations (for NGOs)
      const { data: pendingData, error: pendingError } = await supabase
        .from('donations')
        .select(`
          *,
          categories (*),
          profiles!donations_donor_id_fkey (name, avatar_url)
        `)
        .eq('status', 'pending');
      
      if (pendingError) throw pendingError;
      
      // Fetch user's donations
      const { data: userDonations, error: userDonationsError } = await supabase
        .from('donations')
        .select(`
          *,
          categories (*),
          profiles!donations_donor_id_fkey (name, avatar_url)
        `)
        .eq('donor_id', userId)
        .order('created_at', { ascending: false });
      
      if (userDonationsError) throw userDonationsError;
      
      // Fetch accepted donations for this NGO
      const { data: ngoDonations, error: ngoDonationsError } = await supabase
        .from('donations')
        .select(`
          *,
          categories (*),
          profiles!donations_donor_id_fkey (name, avatar_url)
        `)
        .eq('ngo_id', userId)
        .order('created_at', { ascending: false });
      
      if (ngoDonationsError) throw ngoDonationsError;
      
      // Process pending donations - handle potential SelectQueryError
      const processedPendingDonations = pendingData?.map(donation => {
        return {
          ...donation,
          // If profiles is an error, replace with default value
          profiles: typeof donation.profiles === 'object' ? donation.profiles : { name: 'Unknown', avatar_url: null }
        } as DonationWithDetails;
      }) || [];
      
      setPendingDonations(processedPendingDonations);
      
      // Combine user donations and NGO donations, depending on role
      const allDonations = [
        ...(userDonations || []),
        ...(ngoDonations || [])
      ].filter((donation, index, self) => 
        index === self.findIndex(d => d.id === donation.id)
      );
      
      // Process all donations - handle potential SelectQueryError
      const processedAllDonations = allDonations.map(donation => {
        return {
          ...donation,
          // If profiles is an error, replace with default value
          profiles: typeof donation.profiles === 'object' ? donation.profiles : { name: 'Unknown', avatar_url: null }
        } as DonationWithDetails;
      });
      
      setDonations(processedAllDonations);
    } catch (err: any) {
      console.error('Error fetching donations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDonations();
  }, [userId]);
  
  const addDonation = async (donation: Omit<Donation, 'id' | 'donor_id' | 'ngo_id' | 'status' | 'created_at' | 'updated_at'>): Promise<boolean> => {
    if (!userId) {
      toast.error('You must be logged in to add a donation');
      return false;
    }
    
    try {
      const { data, error } = await supabase
        .from('donations')
        .insert({
          ...donation,
          donor_id: userId
        })
        .select('*, categories (*), profiles!donations_donor_id_fkey (name, avatar_url)')
        .single();
      
      if (error) throw error;
      
      // Process donation - handle potential SelectQueryError
      const processedDonation = {
        ...data,
        // If profiles is an error, replace with default value
        profiles: typeof data.profiles === 'object' ? data.profiles : { name: 'Me', avatar_url: null }
      } as DonationWithDetails;
      
      setDonations(prev => [processedDonation, ...prev]);
      toast.success('Donation added successfully');
      return true;
    } catch (err: any) {
      console.error('Error adding donation:', err);
      toast.error(err.message);
      return false;
    }
  };
  
  const acceptDonation = async (donationId: string): Promise<boolean> => {
    if (!userId) {
      toast.error('You must be logged in to accept a donation');
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('donations')
        .update({
          ngo_id: userId,
          status: 'accepted'
        })
        .eq('id', donationId);
      
      if (error) throw error;
      
      // Update local state
      setPendingDonations(prev => prev.filter(d => d.id !== donationId));
      
      // Fetch the updated donation
      const { data, error: fetchError } = await supabase
        .from('donations')
        .select(`
          *,
          categories (*),
          profiles!donations_donor_id_fkey (name, avatar_url)
        `)
        .eq('id', donationId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Process fetched donation - handle potential SelectQueryError
      const processedDonation = {
        ...data,
        // If profiles is an error, replace with default value
        profiles: typeof data.profiles === 'object' ? data.profiles : { name: 'Unknown', avatar_url: null }
      } as DonationWithDetails;
      
      setDonations(prev => [processedDonation, ...prev]);
      
      toast.success('Donation accepted successfully');
      return true;
    } catch (err: any) {
      console.error('Error accepting donation:', err);
      toast.error(err.message);
      return false;
    }
  };
  
  const completeDonation = async (donationId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('donations')
        .update({
          status: 'completed'
        })
        .eq('id', donationId);
      
      if (error) throw error;
      
      // Update local state
      setDonations(prev => prev.map(donation => 
        donation.id === donationId 
          ? { ...donation, status: 'completed' } 
          : donation
      ));
      
      toast.success('Donation marked as completed');
      return true;
    } catch (err: any) {
      console.error('Error completing donation:', err);
      toast.error(err.message);
      return false;
    }
  };
  
  return {
    pendingDonations,
    donations,
    loading,
    error,
    addDonation,
    acceptDonation,
    completeDonation,
    fetchDonations
  };
};
