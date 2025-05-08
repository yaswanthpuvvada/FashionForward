
import { USD_TO_INR_RATE } from '@/integrations/supabase/client';

export const formatRupees = (amount: number): string => {
  return `₹${(amount).toLocaleString('en-IN')}`;
};

export const convertUSDtoINR = (usdAmount: number): number => {
  return Math.round(usdAmount * USD_TO_INR_RATE);
};

export const formatPrice = (amount: number): string => {
  return formatRupees(amount);
};
