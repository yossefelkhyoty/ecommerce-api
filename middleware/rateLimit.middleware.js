const rateLimit = require('express-rate-limit');

const createLimiter = (windowMs, limit, message) =>
    rateLimit({
        windowMs,
        limit,
        standardHeaders: 'draft-8',
        legacyHeaders: false,
        message: {
            status: 'fail',
            message,
        },
    });

// General API Limiter
exports.apiLimiter = createLimiter(
    15 * 60 * 1000,
    100,
    'Too many requests. Please try again later.'
);

// Login & Signup Limiter
exports.authLimiter = createLimiter(
    15 * 60 * 1000,
    5,
    'Too many authentication attempts. Please try again after 15 minutes.'
);

// Forgot Password Limiter
exports.forgotPasswordLimiter = createLimiter(
    60 * 60 * 1000,
    3,
    'Too many password reset requests. Please try again after 1 hour.'
);

// Verify Reset Code Limiter
exports.verifyResetCodeLimiter = createLimiter(
    15 * 60 * 1000,
    10,
    'Too many verification attempts. Please try again after 15 minutes.'
);