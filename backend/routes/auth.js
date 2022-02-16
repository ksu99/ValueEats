const express = require('express');
const formidable = require('express-formidable');

const router = express.Router();
const { requireLogin } = require('../middlewares');

const { login, register, logout } = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', requireLogin, logout);
module.exports = router;
