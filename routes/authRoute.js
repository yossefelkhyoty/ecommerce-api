const express = require('express');
const {
    authLimiter,
    forgotPasswordLimiter,
    verifyResetCodeLimiter,
} = require('../middleware/rateLimit.middleware');

const { singupValidator, loginValidator } = require('../utils/validators/authValidator')
const { signup, login, forgetPassword, verifyResetCode, resetPassword } = require('../services/authService')

const router = express.Router();

router.post('/signup', authLimiter, singupValidator, signup);
router.post('/login', authLimiter, loginValidator, login);
router.post('/forgotPassword', forgotPasswordLimiter, forgetPassword);
router.post('/verifyResetCode', verifyResetCodeLimiter, verifyResetCode);
router.post('/resetPassword', resetPassword);

module.exports = router;