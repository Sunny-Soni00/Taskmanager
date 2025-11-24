// src/components/home/PricingSection.jsx

import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import { PRICING_PLANS } from '../../constants';

/**
 * PricingSection Component
 * Display pricing plans
 */

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the plan that's right for you. Always know what you'll pay.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRICING_PLANS.map((plan, index) => (
            <Card
              key={index}
              className={`
                relative
                ${plan.highlighted ? 'ring-2 ring-primary-600 dark:ring-primary-400 scale-105' : ''}
                animate-slide-up
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 text-white text-sm font-medium rounded-full">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">
                    {plan.price === 'Custom' ? plan.price : `₹${plan.price}`}
                  </span>
                  {plan.period && (
                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                      /{plan.period}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/signup" className="block">
                <Button
                  variant={plan.highlighted ? 'primary' : 'outline'}
                  size="lg"
                  className="w-full"
                >
                  {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;