import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recommendationAPI } from '../../services/api';
import { Calendar, Gem, ArrowLeft, Trash2 } from 'lucide-react';

function History() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      const response = await recommendationAPI.getUserHistory(email);
      if (response.data.success) {
        setHistory(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      setError('No recommendations found for this email');
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecommendation = (recommendation) => {
    navigate(`/result/${recommendation.id}`, {
      state: { recommendation }
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-600 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </button>

        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Recommendation History
        </h1>

        {/* Email Search */}
        <div className="card mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="email"
              placeholder="Enter your email to view history"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 input-field"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* History List */}
        {history.length > 0 ? (
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Gem className="h-5 w-5 text-primary-600 mr-2" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {item.primaryRecommendation.name}
                      </h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="font-medium">Purpose:</span> {item.purpose}
                      </div>
                      <div>
                        <span className="font-medium">Zodiac:</span> {item.zodiacSign}
                      </div>
                      <div>
                        <span className="font-medium">Match:</span> {item.primaryRecommendation.matchScore}%
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewRecommendation(item)}
                    className="ml-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && !error && (
            <div className="text-center py-12">
              <Gem className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Enter your email to view your recommendation history
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default History;
