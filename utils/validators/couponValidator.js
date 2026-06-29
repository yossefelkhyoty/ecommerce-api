const { check } = require('express-validator');

const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.createCouponValidator = [
    check('name')
        .notEmpty()
        .withMessage('Coupon name is required')
        .isLength({ min: 3, max: 50 })
        .withMessage('Coupon name must be between 3 and 50 characters'),

    check('expire')
        .notEmpty()
        .withMessage('Coupon expire date is required')
        .isISO8601()
        .withMessage('Invalid expire date')
        .custom((value) => {
            if (new Date(value) <= new Date()) {
                throw new Error('Expire date must be in the future');
            }
            return true;
        }),

    check('discount')
        .notEmpty()
        .withMessage('Discount value is required')
        .isFloat({ min: 1, max: 100 })
        .withMessage('Discount must be between 1 and 100'),

    validatorMiddleware,
];

exports.updateCouponValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid coupon id format'),

    check('name')
        .optional()
        .isLength({ min: 3, max: 50 })
        .withMessage('Coupon name must be between 3 and 50 characters'),

    check('expire')
        .optional()
        .isISO8601()
        .withMessage('Invalid expire date')
        .custom((value) => {
            if (new Date(value) <= new Date()) {
                throw new Error('Expire date must be in the future');
            }
            return true;
        }),

    check('discount')
        .optional()
        .isFloat({ min: 1, max: 100 })
        .withMessage('Discount must be between 1 and 100'),

    validatorMiddleware,
];


exports.getCouponValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid coupon id format'),

    validatorMiddleware,
];

exports.deleteCouponValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid coupon id format'),

    validatorMiddleware,
];
