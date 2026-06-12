import React from 'react';
import { Link } from 'react-router-dom';
import { Gem, Sparkles, Shield, TrendingUp, ArrowRight, Star, Sun, Moon } from 'lucide-react';
import { gemstoneAPI } from '../../services/api';

function Home() {
  const [popularGemstones, setPopularGemstones] = React.useState([]);

  React.useEffect(() => {
    gemstoneAPI.getAllGemstones().then(response => {
      setPopularGemstones(response.data.data.slice(0, 4));
    }).catch(error => {
      console.error('Error fetching gemstones:', error);
    });
  }, []);

  const benefits = [
    { icon: Sparkles, title: 'Personalized', description: 'Recommendations based on your birth details and goals' },
    { icon: Shield, title: 'Authentic', description: 'Vedic astrology-based recommendations' },
    { icon: TrendingUp, title: 'Proven Results', description: 'Thousands of satisfied users' },
  ];

  const howItWorks = [
    { step: 1, title: 'Enter Details', description: 'Provide your birth details and purpose' },
    { step: 2, title: 'Get Analysis', description: 'Our engine calculates your zodiac and matches gemstones' },
    { step: 3, title: 'Receive Recommendation', description: 'Get personalized gemstone with wearing instructions' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
              <Gem className="h-16 w-16" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Ideal Gemstone
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Based on Birth Details & Goals
          </p>
          <Link
            to="/recommend"
            className="inline-flex items-center bg-white text-primary-700 font-semibold py-4 px-8 rounded-full hover:bg-primary-50 transition-all duration-200 shadow-xl hover:shadow-2xl"
          >
            Get Your Recommendation
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="card text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-primary-100 dark:bg-primary-900 p-4 rounded-full">
                      <Icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="card">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-primary-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Gemstones */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Popular Gemstones
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularGemstones.map((gemstone) => (
              <div key={gemstone.id} className="card hover:scale-105 transition-transform">
                <div className="flex justify-center mb-4">
                  <img
                    src={gemstone.image}
                    alt={gemstone.name}
                    className="w-20 h-20 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="12" fill="%236b7280"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-center mb-2 text-gray-900 dark:text-white">
                  {gemstone.name}
                </h3>
                <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-2">
                  {gemstone.planet}
                </p>
                <p className="text-sm text-center text-primary-600 font-semibold">
                  {gemstone.priceRange}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/gemstones"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
            >
              View All Gemstones
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Discover Your Perfect Gemstone?
          </h2>
          <p className="text-xl mb-8 text-secondary-100">
            Get personalized recommendations based on Vedic astrology
          </p>
          <Link
            to="/recommend"
            className="inline-flex items-center bg-white text-secondary-700 font-semibold py-4 px-8 rounded-full hover:bg-secondary-50 transition-all duration-200 shadow-xl"
          >
            Start Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
