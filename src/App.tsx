import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Toaster } from "sonner";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import PageSkeleton from "./components/PageSkeleton";
import ScrollToTop from "./components/ScrollToTop";

// Lazy load all pages for better performance
const Index = React.lazy(() => import("./pages/Index"));
const Products = React.lazy(() => import("./pages/Products"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const Cart = React.lazy(() => import("./pages/Cart"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const PaymentSuccess = React.lazy(() => import("./pages/PaymentSuccess"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogDetail = React.lazy(() => import("./pages/BlogDetail"));
const Flashcards = React.lazy(() => import("./pages/Flashcards"));
const FlashcardDetail = React.lazy(() => import("./pages/FlashcardDetail"));
const Chatbot = React.lazy(() => import("./pages/Chatbot"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Admin = React.lazy(() => import("./pages/Admin"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <ScrollToTop />
        <Header />
        <main className="flex-1">
          <Suspense fallback={<PageSkeleton className="container mx-auto px-4 py-8" />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/flashcard" element={<Flashcards />} />
            <Route path="/flashcard/:id" element={<FlashcardDetail />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/flashcards/:id" element={<FlashcardDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <Toaster />
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;