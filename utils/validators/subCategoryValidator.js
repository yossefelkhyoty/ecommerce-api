const {check } = require('express-validator');
const validatorMiddleware=require("../../middleware/validatorMiddleware");

exports.getSubCategoryValidator=[
    check('id').isMongoId().withMessage('Invalid SubCategory id format'),
    validatorMiddleware,
];

exports.createSubCategoryValidator=[
    check('name')
        .notEmpty()
        .withMessage("SubCategory is Required")
        .isLength({min:2})
        .withMessage("Mnimum 2 characters allowed.")
        .isLength({max:32})
        .withMessage("Maximum 32 characters allowed."),
        check('category')
        .notEmpty()
        .withMessage("Category is Required")
        .isMongoId()
        .withMessage("Invalid Category id format"),
    validatorMiddleware,
];

exports.updateSubCategoryValidator=[
    check('id').isMongoId().withMessage('Invalid Subcategory id format'),
        check('name')
        .notEmpty()
        .withMessage("SubCategory is Required(Noting Update)")
        .isLength({min:2})
        .withMessage("Mnimum 2 characters allowed.")
        .isLength({max:32})
        .withMessage("Maximum 32 characters allowed."),
        check('category')
        .isMongoId()
        .withMessage("Invalid Category id format"),
    validatorMiddleware,
];

exports.deleteSubCategoryValidator=[
    check('id').isMongoId().withMessage('Invalid Subcategory id format'),
    validatorMiddleware,
];

