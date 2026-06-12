import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recommendationAPI } from '../../services/api';
import { Calendar, Clock, MapPin, User, Target, DollarSign, Loader2 } from 'lucide-react';

function Recommendation() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    time: '',
    place: '',
    gender: '',
    purpose: '',
    budget: '',
  });

  const purposes = [
    'Career', 'Marriage', 'Education', 'Health', 'Wealth', 'Business', 'Leadership', 'Success', 'Relationships', 'Spirituality'
  ];

  const budgets = ['₹1000 - ₹5000', '₹5000 - ₹10000', '₹10000+'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await recommendationAPI.getRecommendation(formData);
      if (response.data.success) {
        navigate(`/result/${response.data.data.id}`, {
          state: { recommendation: response.data.data }
        });
      }
    } catch (error) {
      console.error('Error getting recommendation:', error);
      alert('Error getting recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Get Your Gemstone Recommendation
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Fill in your details to receive personalized gemstone recommendations
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <User className="h-5 w-5 mr-2 text-primary-600" />
                Personal Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Birth Details */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                Birth Details
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dob"
                    required
                    value={formData.dob}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time of Birth (Optional)
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Place of Birth (Optional)
                </label>
                <input
                  type="text"
                  name="place"
                  value={formData.place}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="City, Country"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Purpose */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <Target className="h-5 w-5 mr-2 text-primary-600" />
                Purpose
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What do you want the gemstone for? *
                </label>
                <select
                  name="purpose"
                  required
                  value={formData.purpose}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select Purpose</option>
                  {purposes.map((purpose) => (
                    <option key={purpose} value={purpose}>
                      {purpose}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Budget */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-primary-600" />
                Budget
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Budget Range (Optional)
                </label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select Budget</option>
                  {budgets.map((budget) => (
                    <option key={budget} value={budget}>
                      {budget}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Get Recommendation'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Recommendation;
