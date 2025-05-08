
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-primary-700">
              Fashion<span className="text-accent">Forward</span>
            </h2>
            <p className="text-gray-600">
              Sustainable fashion that makes a difference. Shop, sell, and donate for a better future.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-gray-600 hover:text-primary-500 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/shop?category=tops" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Tops
                </Link>
              </li>
              <li>
                <Link to="/shop?category=bottoms" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Bottoms
                </Link>
              </li>
              <li>
                <Link to="/shop?category=dresses" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Dresses
                </Link>
              </li>
              <li>
                <Link to="/shop?category=accessories" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/account" className="text-gray-600 hover:text-primary-500 transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Order Status
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-primary-500 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Make a Difference</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/donate" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Donate Clothes
                </Link>
              </li>
              <li>
                <Link to="/requests" className="text-gray-600 hover:text-primary-500 transition-colors">
                  View Requests
                </Link>
              </li>
              <li>
                <Link to="/become-seller" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link to="/ngo-partnership" className="text-gray-600 hover:text-primary-500 transition-colors">
                  NGO Partnership
                </Link>
              </li>
              <li>
                <Link to="/sustainability" className="text-gray-600 hover:text-primary-500 transition-colors">
                  Our Sustainability Commitment
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} FashionForward. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="text-gray-500 text-sm hover:text-primary-500 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-gray-500 text-sm hover:text-primary-500 transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-500 text-sm hover:text-primary-500 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
