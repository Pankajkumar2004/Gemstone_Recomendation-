import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Download, Share2, ArrowLeft, Gem, Sparkles, Shield, Clock, MapPin } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const [recommendation, setRecommendation] = useState(location.state?.recommendation || null);

  useEffect(() => {
    if (!recommendation) {
      navigate('/recommend');
    }
  }, [recommendation, navigate]);

  const handleDownloadPDF = async () => {
    const element = document.getElementById('recommendation-card');
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`gemstone-recommendation-${recommendation?.primaryRecommendation.name}.pdf`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Gemstone Recommendation',
          text: `I was recommended ${recommendation?.primaryRecommendation.name} based on my astrology!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Sharing is not supported on this browser');
    }
  };

  if (!recommendation) {
    return null;
  }

  const { primaryRecommendation, alternatives, explanation, zodiacSign, purpose } = recommendation;

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/recommend')}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-600 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Form
        </button>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mb-6">
          <button
            onClick={handleShare}
            className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all"
          >
            <Download className="h-5 w-5 mr-2" />
            Download PDF
          </button>
        </div>

        {/* Recommendation Card */}
        <div id="recommendation-card" className="card mb-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img
                src={primaryRecommendation.image}
                alt={primaryRecommendation.name}
                className="w-32 h-32 rounded-full object-cover shadow-lg"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect width="128" height="128" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="14" fill="%236b7280"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {primaryRecommendation.name}
            </h1>
            <div className="flex justify-center items-center space-x-2 mb-4">
              <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full font-semibold">
                {primaryRecommendation.matchScore}% Match
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Your zodiac sign is <span className="font-semibold text-primary-600">{zodiacSign}</span>
            </p>
          </div>

          {/* Why Recommended */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary-600" />
              Why Recommended
            </h2>
            <p className="text-gray-700 dark:text-gray-300">{explanation}</p>
          </div>

          {/* Benefits */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary-600" />
              Benefits
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {primaryRecommendation.benefits.map((benefit, index) => (
                <div key={index} className="bg-primary-50 dark:bg-primary-900/30 rounded-lg p-3 text-center">
                  <span className="text-primary-700 dark:text-primary-300 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Wearing Instructions */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary-600" />
              Wearing Instructions
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Metal</p>
                <p className="font-semibold text-gray-900 dark:text-white">{primaryRecommendation.wearInstructions.metal}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Finger</p>
                <p className="font-semibold text-gray-900 dark:text-white">{primaryRecommendation.wearInstructions.finger}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Day</p>
                <p className="font-semibold text-gray-900 dark:text-white">{primaryRecommendation.wearInstructions.day}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Time</p>
                <p className="font-semibold text-gray-900 dark:text-white">{primaryRecommendation.wearInstructions.time}</p>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="bg-secondary-50 dark:bg-secondary-900/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">Price Range</p>
            <p className="text-2xl font-bold text-secondary-700 dark:text-secondary-300">
              {primaryRecommendation.priceRange}
            </p>
          </div>
        </div>

        {/* Alternative Stones */}
        {alternatives && alternatives.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Alternative Stones
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {alternatives.map((alt, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                  <Gem className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{alt.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{alt.planet}</p>
                  <p className="text-sm text-primary-600 font-semibold">{alt.matchScore}% Match</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Result;
