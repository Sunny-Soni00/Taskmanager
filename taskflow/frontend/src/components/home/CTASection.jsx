// src/components/home/CTASection.jsx

import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../common/Button';

/**
 * CTASection Component
 * Call-to-action section
 */

const CTASection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-primary-600 to-blue-600 dark:from-primary-500 dark:to-blue-500 p-12 text-center">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-grid-white/10"></div>
          
          <div className="relative">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of teams already using Umanager to streamline their workflow
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-gray-100 group"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/login">
                <Button 
                  variant="ghost" 
                  size="lg"
                  className="text-white hover:bg-white/10"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;