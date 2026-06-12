const express = require('express');
const router = express.Router();
const GemstoneController = require('../controllers/gemstoneController');

router.get('/', GemstoneController.getAllGemstones);
router.get('/:id', GemstoneController.getGemstoneById);
router.post('/', GemstoneController.addGemstone);
router.put('/:id', GemstoneController.updateGemstone);
router.delete('/:id', GemstoneController.deleteGemstone);
router.get('/mapping/zodiac', GemstoneController.getZodiacMapping);
router.put('/mapping/zodiac', GemstoneController.updateZodiacMapping);

module.exports = router;
