const {check } = require('express-validator');
const validatorMiddleware=require("../../middleware/validatorMiddleware");

exports.getCategoryValidator=[
    check('id').isMongoId().withMessage('Invalid category id format'),
    validatorMiddleware,
];

exports.createCategoryValidator=[
    check('name')
        .notEmpty()
        .withMessage("Category is Required")
        .isLength({min:3})
        .withMessage("Mnimum 3 characters allowed.")
        .isLength({max:32})
        .withMessage("Maximum 32 characters allowed."),
    validatorMiddleware,
];

exports.updateCategoryValidator=[
    check('id').isMongoId().withMessage('Invalid category id format'),
    validatorMiddleware,
];

exports.deleteCategoryValidator=[
    check('id').isMongoId().withMessage('Invalid category id format'),
    validatorMiddleware,
];

