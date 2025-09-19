import React from 'react';
import Hero from '../components/Hero';
import BannerSection from '../components/BannerSection';
import ProductSection from '../components/ProductSection';
import BlogSection from '../components/BlogSection';
import FlashcardSection from '../components/FlashcardSection';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <BannerSection />
      <ProductSection isHomePage={true} />
      <BlogSection isHomePage={true} />
      <FlashcardSection isHomePage={true} />
      <Footer />
    </div>
  );
};

export default Index;
