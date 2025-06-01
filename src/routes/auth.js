const express = require('express');
const router = express.Router();
const { register, verifyEmail } = require('../controllers/auth.controller');

// Registro
router.post('/register', register);
// Email
router.get('/verify-email', verifyEmail); 

module.exports = router;
