const { check } = require('express-validator');
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const ProductModel = require('../../models/productModel');

exports.addProductToCartValidator = [
    check("productId")
        .notEmpty()
        .withMessage("Product id is required")
        .isMongoId()
        .withMessage("Invalid product id format")
        .custom(async (id) => {
            const product = await ProductModel.findById(id);
            if (!product) {
                throw new Error("No product found with this id");
            }
        }),

    check("color")
        .optional()
        .isString()
        .withMessage("Color must be a string"),

    validatorMiddleware,
];

exports.removeSpecificCartItemValidator = [
    check("itemId")
        .isMongoId()
        .withMessage("Invalid cart item id format"),

    validatorMiddleware,
];

exports.updateCartQuantityValidator = [
    check("itemId")
        .isMongoId()
        .withMessage("Invalid cart item id format"),

    check("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .isInt({ min: 1 })
        .withMessage("Quantity must be an integer greater than or equal to 1"),

    validatorMiddleware,
];

exports.applyCouponValidator = [
    check("coupon")
        .trim()
        .notEmpty()
        .withMessage("Coupon name is required"),

    validatorMiddleware,
];