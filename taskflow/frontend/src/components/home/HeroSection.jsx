// src/components/home/HeroSection.jsx

import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../common/Button';
import { APP_TAGLINE, APP_DESCRIPTION } from '../../constants';

/**
 * HeroSection Component
 * Landing page hero section
 */

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <CheckCircle2 size={16} />
            Free for individuals and small teams
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 animate-slide-up">
            {APP_TAGLINE}
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {APP_DESCRIPTION}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/signup">
              <Button variant="primary" size="lg" className="group">
                Start for Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { label: 'Active Users', value: '10K+' },
              { label: 'Tasks Completed', value: '1M+' },
              { label: 'Teams Created', value: '5K+' },
              { label: 'Customer Rating', value: '4.9/5' },
            ].map((stat, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;