const fs = require('fs');
const path = require('path');

class GemstoneController {
  static getAllGemstones(req, res) {
    try {
      const dataPath = path.join(__dirname, '../data/gemstones.json');
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      res.json({ success: true, data: data.gemstones });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static getGemstoneById(req, res) {
    try {
      const { id } = req.params;
      const dataPath = path.join(__dirname, '../data/gemstones.json');
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const gemstone = data.gemstones.find(g => g.id === parseInt(id));
      
      if (!gemstone) {
        return res.status(404).json({ success: false, error: 'Gemstone not found' });
      }
      
      res.json({ success: true, data: gemstone });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static addGemstone(req, res) {
    try {
      const newGemstone = req.body;
      const dataPath = path.join(__dirname, '../data/gemstones.json');
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      newGemstone.id = data.gemstones.length + 1;
      data.gemstones.push(newGemstone);
      
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      res.json({ success: true, data: newGemstone });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static updateGemstone(req, res) {
    try {
      const { id } = req.params;
      const updatedGemstone = req.body;
      const dataPath = path.join(__dirname, '../data/gemstones.json');
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      const index = data.gemstones.findIndex(g => g.id === parseInt(id));
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Gemstone not found' });
      }
      
      data.gemstones[index] = { ...data.gemstones[index], ...updatedGemstone, id: parseInt(id) };
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      res.json({ success: true, data: data.gemstones[index] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static deleteGemstone(req, res) {
    try {
      const { id } = req.params;
      const dataPath = path.join(__dirname, '../data/gemstones.json');
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      const index = data.gemstones.findIndex(g => g.id === parseInt(id));
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Gemstone not found' });
      }
      
      data.gemstones.splice(index, 1);
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      res.json({ success: true, message: 'Gemstone deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static getZodiacMapping(req, res) {
    try {
      const dataPath = path.join(__dirname, '../data/gemstones.json');
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      res.json({ success: true, data: data.zodiacMapping });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static updateZodiacMapping(req, res) {
    try {
      const { mapping } = req.body;
      const dataPath = path.join(__dirname, '../data/gemstones.json');
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      data.zodiacMapping = mapping;
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      res.json({ success: true, data: data.zodiacMapping });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = GemstoneController;
