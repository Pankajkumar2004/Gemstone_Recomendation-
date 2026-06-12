const fs = require('fs');
const path = require('path');
const ZodiacCalculator = require('./zodiacCalculator');

class RecommendationEngine {
  static getGemstonesData() {
    const dataPath = path.join(__dirname, '../data/gemstones.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  }

  static saveRecommendation(recommendation) {
    const dataPath = path.join(__dirname, '../data/recommendations.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    data.recommendations.push(recommendation);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  }

  static saveUser(user) {
    const dataPath = path.join(__dirname, '../data/users.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    // Check if user already exists
    const existingUserIndex = data.users.findIndex(u => u.email === user.email);
    if (existingUserIndex !== -1) {
      data.users[existingUserIndex] = user;
    } else {
      data.users.push(user);
    }
    
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  }

  static calculateMatchScore(gemstone, zodiacSign, purpose, budget) {
    let score = 0;
    let maxScore = 100;

    // Zodiac match (40 points)
    if (gemstone.zodiacSigns && gemstone.zodiacSigns.includes(zodiacSign)) {
      score += 40;
    } else {
      score += 20; // Partial credit for any gemstone
    }

    // Purpose match (40 points)
    if (gemstone.purposes && gemstone.purposes.includes(purpose)) {
      score += 40;
    } else if (gemstone.purposes && gemstone.purposes.length > 0) {
      score += 20; // Partial credit
    }

    // Budget match (20 points)
    if (budget) {
      const budgetMin = this.parseBudget(budget).min;
      const budgetMax = this.parseBudget(budget).max;
      
      if (gemstone.minPrice >= budgetMin && gemstone.maxPrice <= budgetMax) {
        score += 20;
      } else if (gemstone.minPrice <= budgetMax) {
        score += 10;
      }
    } else {
      score += 20; // Full credit if no budget specified
    }

    return Math.min(score, maxScore);
  }

  static parseBudget(budget) {
    if (budget === '₹1000 - ₹5000') return { min: 1000, max: 5000 };
    if (budget === '₹5000 - ₹10000') return { min: 5000, max: 10000 };
    if (budget === '₹10000+') return { min: 10000, max: Infinity };
    return { min: 0, max: Infinity };
  }

  static generateRecommendation(userData) {
    const { name, dob, purpose, budget, gender, email } = userData;
    const gemstonesData = this.getGemstonesData();
    
    // Calculate zodiac sign
    const zodiacInfo = ZodiacCalculator.calculateZodiac(dob);
    const zodiacSign = zodiacInfo.zodiacSign;

    // Calculate match scores for all gemstones
    const scoredGemstones = gemstonesData.gemstones.map(gemstone => {
      const matchScore = this.calculateMatchScore(gemstone, zodiacSign, purpose, budget);
      return {
        ...gemstone,
        matchScore
      };
    });

    // Sort by match score
    scoredGemstones.sort((a, b) => b.matchScore - a.matchScore);

    // Get primary recommendation
    const primaryRecommendation = scoredGemstones[0];
    const alternatives = scoredGemstones.slice(1, 4);

    // Generate explanation
    const explanation = this.generateExplanation(zodiacSign, primaryRecommendation, purpose);

    const recommendation = {
      id: Date.now(),
      userId: email || `user_${Date.now()}`,
      userName: name,
      dob,
      gender,
      purpose,
      budget,
      zodiacSign,
      primaryRecommendation: {
        name: primaryRecommendation.name,
        matchScore: primaryRecommendation.matchScore,
        planet: primaryRecommendation.planet,
        color: primaryRecommendation.color,
        priceRange: primaryRecommendation.priceRange,
        benefits: primaryRecommendation.benefits,
        wearInstructions: primaryRecommendation.wearInstructions,
        alternatives: primaryRecommendation.alternatives,
        description: primaryRecommendation.description
      },
      alternatives: alternatives.map(g => ({
        name: g.name,
        matchScore: g.matchScore,
        planet: g.planet,
        color: g.color,
        priceRange: g.priceRange
      })),
      explanation,
      createdAt: new Date().toISOString()
    };

    // Save recommendation
    this.saveRecommendation(recommendation);

    // Save/update user
    this.saveUser({
      email: email || `user_${Date.now()}`,
      name,
      dob,
      gender,
      createdAt: new Date().toISOString(),
      recommendationCount: 1
    });

    return recommendation;
  }

  static generateExplanation(zodiacSign, gemstone, purpose) {
    const explanations = {
      'Aries': `Your zodiac sign is ${zodiacSign}, ruled by Mars. ${gemstone.name} is governed by ${gemstone.planet}. This combination enhances your natural leadership qualities and brings success in ${purpose.toLowerCase()}.`,
      'Taurus': `Your zodiac sign is ${zodiacSign}, ruled by Venus. ${gemstone.name} is governed by ${gemstone.planet}. This combination enhances your appreciation for beauty and brings prosperity in ${purpose.toLowerCase()}.`,
      'Gemini': `Your zodiac sign is ${zodiacSign}, ruled by Mercury. ${gemstone.name} is governed by ${gemstone.planet}. This combination enhances your communication skills and brings success in ${purpose.toLowerCase()}.`,
      'Cancer': `Your zodiac sign is ${zodiacSign}, ruled by Moon. ${gemstone.name} is governed by ${gemstone.planet}. This combination enhances your emotional intelligence and brings harmony in ${purpose.toLowerCase()}.`,
      'Leo': `Your zodiac sign is ${zodiacSign}, ruled by Sun. ${gemstone.name} is governed by ${gemstone.planet}. This combination enhances your confidence and leadership abilities, perfect for ${purpose.toLowerCase()}.`,
      'Virgo': `Your zodiac sign is ${zodiacSign}, ruled by Mercury. ${gemstone.name} is governed by ${gemstone.planet}. This combination enhances your analytical skills and brings success in ${purpose.toLowerCase()}.`,
      'Libra': `Your zodiac sign is ${zodiacSign}, ruled by Venus. ${gemstone.name} is governed by ${gemstone.planet}. This combination enhances your sense of balance and brings harmony in ${purpose.toLowerCase()}.`,
      'Scorpio': `Your zodiac sign is ${zodiacSign}, ruled by Mars. ${gemstone.name} is governed by ${gemstone.planet}. This combination enhances your determination and brings transformation in ${purpose.toLowerCase()}.`,
      'Sagittarius': `Your zodiac sign is ${zodiacSign}, ruled by Jupiter. ${gemstone.name} is governed by ${gemstone.planet}. This combination enhances your wisdom and brings expansion in ${purpose.toLowerCase()}.`,
      'Capricorn': `Your zodiac sign is ${zodiacSign}, ruled by Saturn. ${gemstone.name} is governed by ${gemstone.planet}. This combination enhances your discipline and brings success in ${purpose.toLowerCase()}.`,
      'Aquarius': `Your zodiac sign is ${zodiacSign}, ruled by Saturn. ${gemstone.name} is governed by ${gemstone.planet}. This combination enhances your innovation and brings progress in ${purpose.toLowerCase()}.`,
      'Pisces': `Your zodiac sign is ${zodiacSign}, ruled by Jupiter. ${gemstone.name} is governed by ${gemstone.planet}. This combination enhances your intuition and brings spiritual growth in ${purpose.toLowerCase()}.`
    };

    return explanations[zodiacSign] || `Your zodiac sign is ${zodiacSign}. ${gemstone.name} is governed by ${gemstone.planet}. This gemstone is suitable for ${purpose.toLowerCase()}.`;
  }

  static getUserRecommendations(email) {
    const dataPath = path.join(__dirname, '../data/recommendations.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    return data.recommendations.filter(r => r.userId === email);
  }

  static getAllRecommendations() {
    const dataPath = path.join(__dirname, '../data/recommendations.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    return data.recommendations;
  }

  static getAnalytics() {
    const recommendations = this.getAllRecommendations();
    const gemstonesData = this.getGemstonesData();

    // Most recommended gemstones
    const gemstoneCounts = {};
    recommendations.forEach(r => {
      const name = r.primaryRecommendation.name;
      gemstoneCounts[name] = (gemstoneCounts[name] || 0) + 1;
    });

    const totalRecommendations = recommendations.length;
    const gemstoneDistribution = Object.entries(gemstoneCounts).map(([name, count]) => ({
      name,
      count,
      percentage: totalRecommendations > 0 ? Math.round((count / totalRecommendations) * 100) : 0
    }));

    // Purpose distribution
    const purposeCounts = {};
    recommendations.forEach(r => {
      const purpose = r.purpose;
      purposeCounts[purpose] = (purposeCounts[purpose] || 0) + 1;
    });

    const purposeDistribution = Object.entries(purposeCounts).map(([purpose, count]) => ({
      purpose,
      count,
      percentage: totalRecommendations > 0 ? Math.round((count / totalRecommendations) * 100) : 0
    }));

    // Monthly recommendations
    const monthlyCounts = {};
    recommendations.forEach(r => {
      const month = new Date(r.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    });

    const monthlyDistribution = Object.entries(monthlyCounts).map(([month, count]) => ({
      month,
      count
    })).slice(-6); // Last 6 months

    return {
      totalRecommendations,
      totalUsers: new Set(recommendations.map(r => r.userId)).size,
      totalGemstones: gemstonesData.gemstones.length,
      gemstoneDistribution,
      purposeDistribution,
      monthlyDistribution,
      mostRecommended: gemstoneDistribution.sort((a, b) => b.count - a.count)[0]?.name || 'N/A'
    };
  }
}

module.exports = RecommendationEngine;
