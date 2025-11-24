// src/pages/home/HomePage.jsx

import Navbar from '../../components/home/Navbar';
import HeroSection from '../../components/home/HeroSection';
import FeaturesSection from '../../components/home/FeaturesSection';
import PricingSection from '../../components/home/PricingSection';
import TestimonialsSection from '../../components/home/TestimonialsSection';
import CTASection from '../../components/home/CTASection';
import Footer from '../../components/home/Footer';

/**
 * HomePage Component
 * Main landing page
 */

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;