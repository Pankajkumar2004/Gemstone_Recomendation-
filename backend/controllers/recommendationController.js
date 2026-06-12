const RecommendationEngine = require('../services/recommendationEngine');

class RecommendationController {
  static getRecommendation(req, res) {
    try {
      const userData = req.body;
      const recommendation = RecommendationEngine.generateRecommendation(userData);
      res.json({ success: true, data: recommendation });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static getUserHistory(req, res) {
    try {
      const { email } = req.params;
      const history = RecommendationEngine.getUserRecommendations(email);
      res.json({ success: true, data: history });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static getAnalytics(req, res) {
    try {
      const analytics = RecommendationEngine.getAnalytics();
      res.json({ success: true, data: analytics });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = RecommendationController;
