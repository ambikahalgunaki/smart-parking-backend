const express = require('express');
const router = express.Router();
const { login, setPassword,getMe } = require('../controllers/authController');

router.post('/login', login);
router.post('/set-password', setPassword);
router.get('/me', getMe);

module.exports = router;