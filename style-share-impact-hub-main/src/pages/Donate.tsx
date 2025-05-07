import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Gift, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DonationForm from '@/components/donations/DonationForm';
import { useDonations } from '@/hooks/useDonations';

const donationImpact = [
  {
    title: "Help People in Need",
    description: "Your donated items will directly help individuals and families who need them the most.",
    icon: <Gift className="h-12 w-12 text-primary-600" />
  },
  {
    title: "Support Local Communities",
    description: "Donations stay within your community, helping local residents and building stronger neighborhoods.",
    icon: <MapPin className="h-12 w-12 text-primary-600" />
  },
  {
    title: "Reduce Waste",
    description: "By donating used clothing, you reduce landfill waste and help protect the environment.",
    icon: <Gift className="h-12 w-12 text-primary-600" />
  }
];

const Donate = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [donationDialogOpen, setDonationDialogOpen] = useState(false);
  const { addDonation, loading } = useDonations(user?.id); // Pass user id here
  
  const handleDonate = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setDonationDialogOpen(true);
  };
  
  const handleDonationSubmit = async (formData: any, images: File[]) => {
    await addDonation({
      ...formData,
      images
    });
    setDonationDialogOpen(false);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-100 to-primary-50 rounded-lg overflow-hidden mb-12">
          <div className="py-16 px-8 md:px-12 lg:px-16 max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Make a Difference with Your Donation</h1>
            <p className="text-lg mb-8">
              Donate your gently used clothing and accessories to help those in need. Your donations make a real impact!
            </p>
            <Button size="lg" onClick={handleDonate}>
              Donate Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">How Donation Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
            <div className="text-center">
              <div className="bg-primary-100 h-16 w-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-700">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Donate an Item</h3>
              <p className="text-gray-600">
                Upload photos and details of your gently used clothing or accessories.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 h-16 w-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-700">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">NGO Accepts</h3>
              <p className="text-gray-600">
                A verified NGO partner reviews and accepts your donation.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 h-16 w-16 flex items-center justify-center rounded-full mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-700">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Deliver or Pickup</h3>
              <p className="text-gray-600">
                Coordinate with the NGO for direct delivery or pickup of your items.
              </p>
            </div>
          </div>
        </div>
        
        {/* Impact */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Your Impact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {donationImpact.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <div className="bg-primary-700 rounded-lg overflow-hidden mb-12 text-white">
          <div className="py-12 px-8 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="mb-6">
              Your donations help people in need and contribute to a more sustainable future.
            </p>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white text-primary-700 hover:bg-primary-50"
              onClick={handleDonate}
            >
              Donate Now
            </Button>
          </div>
        </div>
        
        {/* Donation Dialog */}
        <Dialog open={donationDialogOpen} onOpenChange={setDonationDialogOpen}>
          <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Donate an Item</DialogTitle>
            </DialogHeader>
            <DonationForm
              onSubmit={handleDonationSubmit}
              isSubmitting={loading}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Donate;
