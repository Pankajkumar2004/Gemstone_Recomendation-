const fs = require('fs');
const path = require('path');

class UserController {
  static getAllUsers(req, res) {
    try {
      const dataPath = path.join(__dirname, '../data/users.json');
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      res.json({ success: true, data: data.users });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static getUserById(req, res) {
    try {
      const { email } = req.params;
      const dataPath = path.join(__dirname, '../data/users.json');
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const user = data.users.find(u => u.email === email);
      
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static deleteUser(req, res) {
    try {
      const { email } = req.params;
      const dataPath = path.join(__dirname, '../data/users.json');
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      const index = data.users.findIndex(u => u.email === email);
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      
      data.users.splice(index, 1);
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = UserController;
