import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import DonationCard from '@/components/DonationCard';
import { Gift, Heart, FileText, Plus, Check, X, Edit, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useDonations, DonationWithDetails } from '@/hooks/useDonations';
import { useRequests, type Request, type RequestItem } from '@/hooks/useRequests';
import { useCategories } from '@/hooks/useCategories';
import { formatPrice } from '@/utils/currency';

interface DonationCardProps {
  donation: DonationWithDetails;
  isNgo?: boolean;
  onAccept?: () => void;
  onComplete?: () => void;
}

const NgoDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("donations");
  const { categories } = useCategories();
  
  // Donation hooks
  const {
    pendingDonations,
    donations: acceptedDonations,
    loading: loadingDonations,
    acceptDonation,
    completeDonation,
    fetchDonations
  } = useDonations(user?.id);
  
  // Request hooks
  const {
    requests: ngoRequests,
    loading: loadingRequests,
    addRequest,
    updateRequestStatus,
    fetchRequests
  } = useRequests(user?.id);
  
  // Form state for new request
  const [requestForm, setRequestForm] = useState({
    title: '',
    description: '',
    items: [
      { category_id: '', quantity: 1, gender: 'unisex' as const, urgency: 'medium' as const }
    ]
  });
  
  // Request dialog state
  const [viewRequestDialogOpen, setViewRequestDialogOpen] = useState(false);
  const [editRequestDialogOpen, setEditRequestDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  
  useEffect(() => {
    if (user) {
      fetchDonations();
      fetchRequests();
    }
  }, [user]);
  
  const handleRequestFormChange = (field: string, value: string) => {
    setRequestForm(prev => ({ ...prev, [field]: value }));
  };
  
  const handleItemChange = (index: number, field: string, value: string | number) => {
    setRequestForm(prev => {
      const updatedItems = [...prev.items];
      updatedItems[index] = { ...updatedItems[index], [field]: value };
      return { ...prev, items: updatedItems };
    });
  };
  
  const handleAddItem = () => {
    setRequestForm(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { category_id: '', quantity: 1, gender: 'unisex' as const, urgency: 'medium' as const }
      ]
    }));
  };
  
  const handleRemoveItem = (index: number) => {
    if (requestForm.items.length === 1) {
      toast.error("You need at least one item");
      return;
    }
    
    setRequestForm(prev => {
      const updatedItems = [...prev.items];
      updatedItems.splice(index, 1);
      return { ...prev, items: updatedItems };
    });
  };
  
  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!requestForm.title.trim() || !requestForm.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    let isValid = true;
    requestForm.items.forEach(item => {
      if (!item.category_id) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      toast.error("Please select a category for all items");
      return;
    }
    
    // Submit request
    try {
      await addRequest({
        title: requestForm.title,
        description: requestForm.description,
        items: requestForm.items as RequestItem[]
      });
      
      // Reset form
      setRequestForm({
        title: '',
        description: '',
        items: [
          { category_id: '', quantity: 1, gender: 'unisex' as const, urgency: 'medium' as const }
        ]
      });
      
      setActiveTab("requests");
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };
  
  const handleViewRequest = (request: Request) => {
    setSelectedRequest(request);
    setViewRequestDialogOpen(true);
  };
  
  const handleEditRequest = (request: Request) => {
    setSelectedRequest(request);
    setEditRequestDialogOpen(true);
  };
  
  const handleUpdateRequestStatus = async (request: Request, status: 'open' | 'in-progress' | 'fulfilled' | 'closed') => {
    if (await updateRequestStatus(request.id, status)) {
      setViewRequestDialogOpen(false);
      setSelectedRequest(null);
    }
  };
  
  const handleAcceptDonation = async (donationId: string) => {
    await acceptDonation(donationId);
  };
  
  const handleCompleteDonation = async (donationId: string) => {
    await completeDonation(donationId);
  };
  
  return (
    <ProtectedRoute allowedRoles={['ngo']}>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold">NGO Dashboard</h1>
              <p className="text-gray-500">Welcome back, {user?.name}</p>
            </div>
            <Button variant="outline" onClick={() => logout()}>Logout</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Donations Received</p>
                  <p className="text-2xl font-bold">{acceptedDonations.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <Gift className="h-6 w-6 text-primary-700" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Available Donations</p>
                  <p className="text-2xl font-bold">{pendingDonations.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary-700" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Active Requests</p>
                  <p className="text-2xl font-bold">{ngoRequests.filter(r => r.status === 'open').length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary-700" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="donations" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="donations">Available Donations</TabsTrigger>
              <TabsTrigger value="received">Received Donations</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
            </TabsList>
            
            {/* Available Donations Tab */}
            <TabsContent value="donations">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold mb-6">Available Donations</h2>
                
                {loadingDonations ? (
                  <div className="text-center py-8">Loading donations...</div>
                ) : pendingDonations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pendingDonations.map(donation => (
                      <DonationCard 
                        key={donation.id} 
                        donation={donation}
                        isNgo={true}
                        onAccept={() => handleAcceptDonation(donation.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No available donations</h3>
                    <p className="text-gray-500 mb-4">
                      There are currently no pending donations. Check back later!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Received Donations Tab */}
            <TabsContent value="received">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold mb-6">Received Donations</h2>
                
                {loadingDonations ? (
                  <div className="text-center py-8">Loading donations...</div>
                ) : acceptedDonations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {acceptedDonations.map(donation => (
                      <DonationCard 
                        key={donation.id} 
                        donation={donation}
                        isNgo={true}
                        onComplete={donation.status === 'accepted' ? () => handleCompleteDonation(donation.id) : undefined}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Gift className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No received donations</h3>
                    <p className="text-gray-500 mb-4">
                      You haven't accepted any donations yet.
                    </p>
                    <Button onClick={() => setActiveTab("donations")}>
                      View Available Donations
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Requests Tab */}
            <TabsContent value="requests">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <h2 className="text-xl font-semibold">Your Requests</h2>
                  <Button 
                    onClick={() => setActiveTab("new-request")}
                    className="md:w-auto w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Create New Request
                  </Button>
                </div>
                
                {loadingRequests ? (
                  <div className="text-center py-8">Loading requests...</div>
                ) : ngoRequests.length > 0 ? (
                  <div className="space-y-6">
                    {ngoRequests.map(request => (
                      <div 
                        key={request.id} 
                        className="border border-gray-200 rounded-lg p-6"
                      >
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{request.title}</h3>
                            <p className="text-sm text-gray-500">
                              Created on {new Date(request.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium 
                            ${request.status === 'fulfilled' ? 'bg-green-100 text-green-800' : 
                              request.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                              request.status === 'closed' ? 'bg-gray-100 text-gray-800' : 
                              'bg-yellow-100 text-yellow-800'}`}
                          >
                            {request.status === 'in-progress' ? 'In Progress' : 
                              request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{request.description}</p>
                        
                        <h4 className="font-medium text-gray-900 mb-2">Requested Items:</h4>
                        <div className="space-y-2 mb-4">
                          {request.items?.map((item, idx) => (
                            <div key={idx} className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-md">
                              <div className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-sm">
                                {categories.find(c => c.id === item.category_id)?.name || item.category_id}
                              </div>
                              <div className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm">
                                Qty: {item.quantity}
                              </div>
                              {item.gender && item.gender !== 'unisex' && (
                                <div className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm capitalize">
                                  {item.gender}
                                </div>
                              )}
                              <div className={`px-2 py-1 rounded text-sm
                                ${item.urgency === 'critical' ? 'bg-red-100 text-red-700' :
                                  item.urgency === 'high' ? 'bg-orange-100 text-orange-700' :
                                  item.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'} capitalize`}
                              >
                                {item.urgency} urgency
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline"
                            onClick={() => handleViewRequest(request)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => handleEditRequest(request)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          {request.status === 'open' ? (
                            <Button 
                              variant="outline"
                              onClick={() => handleUpdateRequestStatus(request, 'closed')}
                            >
                              Close Request
                            </Button>
                          ) : (
                            <Button 
                              variant="outline"
                              onClick={() => handleUpdateRequestStatus(request, 'open')}
                            >
                              Reopen Request
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No requests yet</h3>
                    <p className="text-gray-500 mb-4">
                      You haven't created any requests yet.
                    </p>
                    <Button onClick={() => setActiveTab("new-request")}>
                      Create Your First Request
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* New Request Tab (not in TabsList but can be activated) */}
            <TabsContent value="new-request">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-xl font-semibold">Create New Request</h2>
                  <Button 
                    variant="ghost" 
                    onClick={() => setActiveTab("requests")}
                    className="text-gray-500"
                  >
                    Cancel
                  </Button>
                </div>
                
                <form onSubmit={handleSubmitRequest} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Request Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Winter Clothing Drive"
                      value={requestForm.title}
                      onChange={(e) => handleRequestFormChange('title', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Please provide details about your request and how the donations will be used..."
                      value={requestForm.description}
                      onChange={(e) => handleRequestFormChange('description', e.target.value)}
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Items Needed *</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={handleAddItem}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Item
                      </Button>
                    </div>
                    
                    {requestForm.items.map((item, index) => (
                      <div 
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 space-y-4"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Item {index + 1}</h4>
                          {requestForm.items.length > 1 && (
                            <Button 
                              type="button"
                              variant="ghost" 
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleRemoveItem(index)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`category-${index}`}>Category *</Label>
                            <Select
                              value={item.category_id}
                              onValueChange={(value) => handleItemChange(index, 'category_id', value)}
                            >
                              <SelectTrigger id={`category-${index}`}>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map(category => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`quantity-${index}`}>Quantity Needed *</Label>
                            <Input
                              id={`quantity-${index}`}
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`gender-${index}`}>Gender</Label>
                            <Select
                              value={item.gender}
                              onValueChange={(value) => handleItemChange(index, 'gender', value)}
                            >
                              <SelectTrigger id={`gender-${index}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="unisex">Unisex</SelectItem>
                                <SelectItem value="men">Men</SelectItem>
                                <SelectItem value="women">Women</SelectItem>
                                <SelectItem value="children">Children</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`urgency-${index}`}>Urgency Level</Label>
                            <Select
                              value={item.urgency}
                              onValueChange={(value) => handleItemChange(index, 'urgency', value)}
                            >
                              <SelectTrigger id={`urgency-${index}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit" className="w-full">
                      Submit Request
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* View Request Dialog */}
          <Dialog open={viewRequestDialogOpen} onOpenChange={setViewRequestDialogOpen}>
            <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Request Details</DialogTitle>
              </DialogHeader>
              {selectedRequest && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">{selectedRequest.title}</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium 
                      ${selectedRequest.status === 'fulfilled' ? 'bg-green-100 text-green-800' : 
                        selectedRequest.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                        selectedRequest.status === 'closed' ? 'bg-gray-100 text-gray-800' : 
                        'bg-yellow-100 text-yellow-800'}`}
                    >
                      {selectedRequest.status === 'in-progress' ? 'In Progress' : 
                        selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 text-sm mb-2">
                      Created on {new Date(selectedRequest.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700">{selectedRequest.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Requested Items:</h4>
                    <div className="space-y-3">
                      {selectedRequest.items?.map((item, idx) => (
                        <div key={idx} className="border rounded-lg p-4">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <div className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-sm">
                              {categories.find(c => c.id === item.category_id)?.name || item.category_id}
                            </div>
                            <div className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm">
                              Qty: {item.quantity}
                            </div>
                            {item.gender && item.gender !== 'unisex' && (
                              <div className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm capitalize">
                                {item.gender}
                              </div>
                            )}
                            <div className={`px-2 py-1 rounded text-sm
                              ${item.urgency === 'critical' ? 'bg-red-100 text-red-700' :
                                item.urgency === 'high' ? 'bg-orange-100 text-orange-700' :
                                item.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'} capitalize`}
                            >
                              {item.urgency} urgency
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Update Status:</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={selectedRequest.status === 'open' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleUpdateRequestStatus(selectedRequest, 'open')}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Open
                      </Button>
                      <Button
                        variant={selectedRequest.status === 'in-progress' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleUpdateRequestStatus(selectedRequest, 'in-progress')}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        In Progress
                      </Button>
                      <Button
                        variant={selectedRequest.status === 'fulfilled' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleUpdateRequestStatus(selectedRequest, 'fulfilled')}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Fulfilled
                      </Button>
                      <Button
                        variant={selectedRequest.status === 'closed' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleUpdateRequestStatus(selectedRequest, 'closed')}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Closed
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
          
          {/* TODO: Add Edit Request Dialog if needed */}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default NgoDashboard;
