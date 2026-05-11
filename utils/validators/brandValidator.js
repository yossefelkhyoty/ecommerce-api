const { default: slugify } = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Brand id format'),
    validatorMiddleware,
];

exports.createBrandValidator = [
    check('name')
        .notEmpty()
        .withMessage("Brand is Required")
        .isLength({ min: 3 })
        .withMessage("Mnimum 3 characters allowed.")
        .isLength({ max: 32 })
        .withMessage("Maximum 32 characters allowed.")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    validatorMiddleware,
];

exports.updateBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Brand id format'),
    body('name').optional().custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMiddleware,
];

exports.deleteBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Brand id format'),
    validatorMiddleware,
];

