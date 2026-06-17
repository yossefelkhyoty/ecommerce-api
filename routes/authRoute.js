const express = require('express');

const { singupValidator, loginValidator } = require('../utils/validators/authValidator')
const { signup, login, forgetPassword, verifyResetCode, resetPassword } = require('../services/authServices')

const router = express.Router();

router.post('/signup', singupValidator, signup);
router.post('/login', loginValidator, login);
router.post('/forgetPassword', forgetPassword);
router.post('/verifyResetCode', verifyResetCode);
router.post('/resetPassword',resetPassword);

module.exports = router;