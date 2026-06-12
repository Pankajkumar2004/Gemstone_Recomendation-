const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.get('/', UserController.getAllUsers);
router.get('/:email', UserController.getUserById);
router.delete('/:email', UserController.deleteUser);

module.exports = router;
