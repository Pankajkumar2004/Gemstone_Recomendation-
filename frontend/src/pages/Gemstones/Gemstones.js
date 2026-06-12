import React, { useState, useEffect } from 'react';
import { gemstoneAPI } from '../../services/api';
import { Gem, Filter, Search } from 'lucide-react';

function Gemstones() {
  const [gemstones, setGemstones] = useState([]);
  const [filteredGemstones, setFilteredGemstones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlanet, setSelectedPlanet] = useState('All');
  const [selectedPurpose, setSelectedPurpose] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    gemstoneAPI.getAllGemstones().then(response => {
      setGemstones(response.data.data);
      setFilteredGemstones(response.data.data);
    }).catch(error => {
      console.error('Error fetching gemstones:', error);
    });
  }, []);

  const planets = ['All', ...new Set(gemstones.map(g => g.planet))];
  const purposes = ['All', ...new Set(gemstones.flatMap(g => g.purposes || []))];
  const priceRanges = ['All', 'Under ₹5000', '₹5000 - ₹10000', '₹10000+'];

  useEffect(() => {
    let filtered = gemstones;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.planet.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Planet filter
    if (selectedPlanet !== 'All') {
      filtered = filtered.filter(g => g.planet === selectedPlanet);
    }

    // Purpose filter
    if (selectedPurpose !== 'All') {
      filtered = filtered.filter(g => g.purposes && g.purposes.includes(selectedPurpose));
    }

    // Price filter
    if (selectedPriceRange !== 'All') {
      filtered = filtered.filter(g => {
        if (selectedPriceRange === 'Under ₹5000') return g.maxPrice < 5000;
        if (selectedPriceRange === '₹5000 - ₹10000') return g.minPrice >= 5000 && g.maxPrice <= 10000;
        if (selectedPriceRange === '₹10000+') return g.minPrice >= 10000;
        return true;
      });
    }

    setFilteredGemstones(filtered);
  }, [searchTerm, selectedPlanet, selectedPurpose, selectedPriceRange, gemstones]);

  const getColorClass = (color) => {
    const colorMap = {
      'Red': 'bg-red-100',
      'Green': 'bg-green-100',
      'Blue': 'bg-blue-100',
      'Yellow': 'bg-yellow-100',
      'White': 'bg-gray-100',
      'Brown/Red': 'bg-orange-100',
      'Yellow/Green': 'bg-lime-100',
    };
    return colorMap[color] || 'bg-gray-100';
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Gemstone Catalog
        </h1>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search gemstones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center mb-6 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all"
        >
          <Filter className="h-5 w-5 mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Filters */}
        {showFilters && (
          <div className="card mb-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Planet
                </label>
                <select
                  value={selectedPlanet}
                  onChange={(e) => setSelectedPlanet(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  {planets.map(planet => (
                    <option key={planet} value={planet}>{planet}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Purpose
                </label>
                <select
                  value={selectedPurpose}
                  onChange={(e) => setSelectedPurpose(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  {purposes.map(purpose => (
                    <option key={purpose} value={purpose}>{purpose}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price Range
                </label>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  {priceRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Showing {filteredGemstones.length} of {gemstones.length} gemstones
        </p>

        {/* Gemstones Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGemstones.map((gemstone) => (
            <div key={gemstone.id} className="card hover:scale-105 transition-transform">
              <div className="flex justify-center mb-4">
                <img
                  src={gemstone.image}
                  alt={gemstone.name}
                  className="w-24 h-24 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect width="96" height="96" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="12" fill="%236b7280"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2 text-gray-900 dark:text-white">
                {gemstone.name}
              </h3>
              <p className="text-center text-gray-600 dark:text-gray-300 mb-2">
                {gemstone.planet}
              </p>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                {gemstone.color}
              </p>
              <p className="text-center text-primary-600 font-semibold mb-4">
                {gemstone.priceRange}
              </p>
              <div className="border-t dark:border-gray-700 pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span className="font-medium">Benefits:</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {gemstone.benefits.slice(0, 3).map((benefit, index) => (
                    <span key={index} className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGemstones.length === 0 && (
          <div className="text-center py-12">
            <Gem className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No gemstones found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Gemstones;
