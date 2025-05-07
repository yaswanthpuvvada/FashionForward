
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_REQUESTS, CATEGORIES } from '@/data/mockData';
import { Search, Filter, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const Requests = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Apply filters
  const filteredRequests = MOCK_REQUESTS.filter(request => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilters.length === 0 || 
      request.items.some(item => categoryFilters.includes(item.category));
    
    // Status filter
    const matchesStatus = !statusFilter || request.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const toggleCategoryFilter = (categoryId: string) => {
    setCategoryFilters(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setCategoryFilters([]);
    setStatusFilter(null);
  };
  
  const handleHelp = (requestId: string) => {
    if (!isAuthenticated) {
      toast.error("Please log in to respond to requests");
      navigate("/login");
      return;
    }
    
    toast.success("Thank you for offering to help! The NGO will be in touch with you shortly.");
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3">Clothing Requests</h1>
            <p className="text-xl text-gray-600">
              Browse requests from NGOs and individuals in need of clothing donations.
            </p>
          </div>
          
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                type="search"
                placeholder="Search requests..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter || undefined} onValueChange={(value) => setStatusFilter(value || null)}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="fulfilled">Fulfilled</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              className="md:w-auto w-full flex justify-between items-center"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            >
              <span className="flex items-center">
                <Filter className="mr-2 h-4 w-4" /> Categories
              </span>
              {isMobileFilterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
          
          {/* Mobile Category Filters */}
          {isMobileFilterOpen && (
            <div className="md:hidden mb-6 p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between mb-3">
                <h3 className="font-medium">Categories</h3>
                <button 
                  onClick={clearAllFilters}
                  className="text-sm text-primary-600"
                >
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map(category => (
                  <div key={category.id} className="flex items-center">
                    <Checkbox
                      id={`mobile-category-${category.id}`}
                      checked={categoryFilters.includes(category.id)}
                      onCheckedChange={() => toggleCategoryFilter(category.id)}
                    />
                    <label 
                      htmlFor={`mobile-category-${category.id}`}
                      className="ml-2 text-sm"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-8">
            {/* Desktop Category Filter Sidebar */}
            <div className="hidden md:block w-56 flex-shrink-0">
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 sticky top-20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Categories</h3>
                  <button 
                    onClick={clearAllFilters}
                    className="text-sm text-primary-600"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-2">
                  {CATEGORIES.map(category => (
                    <div key={category.id} className="flex items-center">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={categoryFilters.includes(category.id)}
                        onCheckedChange={() => toggleCategoryFilter(category.id)}
                      />
                      <label 
                        htmlFor={`category-${category.id}`}
                        className="ml-2 text-sm cursor-pointer"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Requests List */}
            <div className="flex-1">
              {filteredRequests.length > 0 ? (
                <div className="space-y-6">
                  {filteredRequests.map(request => (
                    <div 
                      key={request.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-semibold text-lg">{request.title}</h3>
                              <Badge 
                                variant={
                                  request.status === 'open' ? 'default' : 
                                  request.status === 'in-progress' ? 'secondary' :
                                  request.status === 'fulfilled' ? 'outline' : 'secondary'
                                }
                                className="ml-3"
                              >
                                {request.status === 'in-progress' ? 'In Progress' : 
                                  request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
                              <span>{request.requesterName}</span>
                              <span>•</span>
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(request.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
                          {request.status === 'open' && (
                            <Button onClick={() => handleHelp(request.id)}>
                              I Can Help
                            </Button>
                          )}
                        </div>
                        
                        <p className="mb-4 text-gray-700">{request.description}</p>
                        
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Items Needed:</h4>
                        <div className="flex flex-wrap gap-2">
                          {request.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1 text-sm bg-gray-100 rounded px-3 py-1">
                              <span>
                                {CATEGORIES.find(c => c.id === item.category)?.name || item.category}
                              </span>
                              <span className="text-gray-500">
                                ({item.quantity})
                              </span>
                              {item.urgency === 'high' || item.urgency === 'critical' ? (
                                <Badge variant="destructive" className="h-5 ml-1 text-[10px]">
                                  {item.urgency}
                                </Badge>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No requests found</h3>
                  <p className="mt-2 text-gray-500">
                    Try adjusting your filters or check back later for new requests
                  </p>
                  <Button 
                    className="mt-4"
                    variant="outline"
                    onClick={clearAllFilters}
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-16 bg-primary-100 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold text-primary-800 mb-3">Would you like to make a request?</h2>
            <p className="text-lg text-primary-700 mb-6">
              If you're part of an NGO or community organization, you can create a request for clothing donations.
            </p>
            {isAuthenticated && user?.role === 'ngo' ? (
              <Button size="lg" asChild>
                <a href="/ngo-dashboard">Create a Request</a>
              </Button>
            ) : (
              <Button size="lg" asChild>
                <a href="/ngo-partnership">Register as an NGO Partner</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Requests;
