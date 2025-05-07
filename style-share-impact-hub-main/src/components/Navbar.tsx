import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  User,
  LogIn,
  Package,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getUserInitials = () => {
    if (!user?.name) return '?';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const renderAuthLinks = () => {
    if (isAuthenticated) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                {user?.avatar_url ? (
                  <AvatarImage src={user.avatar_url} alt={user?.name || 'User'} />
                ) : (
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                )}
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/account">My Account</Link>
            </DropdownMenuItem>
            
            {user?.role === 'seller' && (
              <DropdownMenuItem asChild>
                <Link to="/seller-dashboard">Seller Dashboard</Link>
              </DropdownMenuItem>
            )}
            
            {user?.role === 'ngo' && (
              <DropdownMenuItem asChild>
                <Link to="/ngo-dashboard">NGO Dashboard</Link>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    
    return (
      <Button variant="outline" asChild>
        <Link to="/login">
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Link>
      </Button>
    );
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">
          Clothing Donation App
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/shop">Shop</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/donate">Donate</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/requests">Requests</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>
          {renderAuthLinks()}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-50 py-2">
          <div className="container mx-auto px-4 flex flex-col space-y-2">
            <Button variant="ghost" className="justify-start" asChild>
              <Link to="/shop">Shop</Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link to="/donate">Donate</Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link to="/requests">Requests</Link>
            </Button>
            <Button variant="ghost" className="justify-start relative" asChild>
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>
            {isAuthenticated ? (
              <>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/account">My Account</Link>
                </Button>
                {user?.role === 'seller' && (
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link to="/seller-dashboard">Seller Dashboard</Link>
                  </Button>
                )}
                {user?.role === 'ngo' && (
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link to="/ngo-dashboard">NGO Dashboard</Link>
                  </Button>
                )}
                <Button variant="ghost" className="justify-start text-red-600" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
