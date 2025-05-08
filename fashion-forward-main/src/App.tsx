
// Add the demo accounts page to the routes
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

// Pages
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import SellerDashboard from "./pages/SellerDashboard";
import NgoDashboard from "./pages/NgoDashboard";
import Donate from "./pages/Donate";
import Requests from "./pages/Requests";
import Cart from "./pages/Cart";
import OrderSuccess from "./pages/OrderSuccess";
import NotFound from "./pages/NotFound";
import DemoAccounts from "./pages/DemoAccounts"; // Add the demo accounts page

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/account" element={<Account />} />
              <Route path="/seller-dashboard" element={<SellerDashboard />} />
              <Route path="/ngo-dashboard" element={<NgoDashboard />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/demo-accounts" element={<DemoAccounts />} /> {/* Add the demo accounts route */}
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
