const { check } = require('express-validator');
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const ProductModel = require('../../models/productModel');


exports.addWishlistValidator = [
    check('productId')
        .isMongoId()
        .withMessage('Invalid product id format')
        .custom(async (val) => {
            const product = await ProductModel.findById(val);
            if (!product) {
                throw new Error('No product found for this id');
            }
            return true;
        }),
    validatorMiddleware,
];

exports.removeWishlistValidator = [
    check('productId')
        .isMongoId()
        .withMessage('Invalid product id format'),
    validatorMiddleware,
];