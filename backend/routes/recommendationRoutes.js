const express = require('express');
const router = express.Router();
const RecommendationController = require('../controllers/recommendationController');

router.post('/', RecommendationController.getRecommendation);
router.get('/history/:email', RecommendationController.getUserHistory);
router.get('/analytics', RecommendationController.getAnalytics);

module.exports = router;
