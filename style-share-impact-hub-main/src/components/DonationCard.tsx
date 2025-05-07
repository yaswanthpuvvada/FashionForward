
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift } from 'lucide-react';
import type { DonationWithDetails } from '@/hooks/useDonations';

interface DonationCardProps {
  donation: DonationWithDetails;
  className?: string;
  isNgo?: boolean;
  onAccept?: () => void;
  onComplete?: () => void;
}

const DonationCard: React.FC<DonationCardProps> = ({ 
  donation, 
  className, 
  isNgo = false,
  onAccept,
  onComplete
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date properly
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className={cn("bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100", className)}>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg text-gray-800">
              {donation.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              From {donation.profiles?.name || 'Unknown'} on {formatDate(donation.created_at)}
            </p>
          </div>
          <Badge className={cn("capitalize", getStatusColor(donation.status))}>
            {donation.status}
          </Badge>
        </div>

        <div className="mt-4">
          <p className="text-gray-700 line-clamp-2">{donation.description}</p>
          
          <div className="mt-3 flex flex-wrap gap-2">
            {donation.categories && (
              <Badge variant="outline" className="text-xs">
                {donation.categories.name || 'Uncategorized'}
              </Badge>
            )}
            {donation.gender && (
              <Badge variant="outline" className="text-xs capitalize">
                {donation.gender}
              </Badge>
            )}
            {donation.size && (
              <Badge variant="outline" className="text-xs">
                Size: {donation.size}
              </Badge>
            )}
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs capitalize",
                donation.condition === 'new' ? "border-green-500 text-green-700" : 
                donation.condition === 'like new' ? "border-green-400 text-green-600" : 
                donation.condition === 'good' ? "border-blue-400 text-blue-600" : 
                donation.condition === 'fair' ? "border-yellow-400 text-yellow-700" : 
                "border-red-400 text-red-600"
              )}
            >
              {donation.condition}
            </Badge>
          </div>
        </div>

        <div className="mt-4">
          {donation.images && donation.images.length > 0 && (
            <div className="h-40 rounded overflow-hidden bg-gray-100">
              <img 
                src={donation.images[0]} 
                alt={donation.title} 
                className="h-full w-full object-cover" 
              />
            </div>
          )}
        </div>

        {isNgo && donation.status === 'pending' && onAccept && (
          <div className="mt-5 flex gap-2">
            <Button onClick={onAccept}>Accept Donation</Button>
          </div>
        )}

        {isNgo && donation.status === 'accepted' && onComplete && (
          <div className="mt-5">
            <Button onClick={onComplete}>Mark as Completed</Button>
          </div>
        )}

        {!isNgo && (
          <div className="mt-5">
            <Button variant="outline" className="w-full">View Details</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationCard;
