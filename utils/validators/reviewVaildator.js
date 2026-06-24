const { check} = require('express-validator');

const validatorMiddleware = require("../../middleware/validatorMiddleware");
const ReviewModel = require('../../models/reviewModel');
const ProductModel = require('../../models/productModel');

exports.getReviewValidator = [
    check('id').isMongoId().withMessage('Invalid Review id format'),
    validatorMiddleware,
];

exports.createReviewValidator = [
    check('title')
        .notEmpty()
        .withMessage("Review is Required"),
    check('ratings').notEmpty()
        .withMessage('ratings value required')
        .isFloat({ min: 1, max: 5 })
        .withMessage('Ratings value must be between 1 to 5'),
    check('product')
        .notEmpty()
        .withMessage('Product is required')
        .isMongoId()
        .withMessage('Invalid Review id format')
        .custom(async (value, { req }) => {
            const product = await ProductModel.exists({
                _id: value
            });

            if (!product) {
                throw new Error('No product found for this id');
            }
            // Check if logged user create review before
            const review = await ReviewModel.findOne({ user: req.user._id, product: value });
            if (review) {
                throw new Error('You already created a review before');
            }
            return true;
        }),

    validatorMiddleware,
];

exports.updateReviewValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Review id format')
        .custom(async (val, { req }) => {
            const review = await ReviewModel.findById(val);
            if (!review) {
                throw new Error(`There is no review with id ${val}`);
            }
            if (review.user._id.toString() !== req.user._id.toString()) {
                throw new Error(`Your are not allowed to perform this action`)
            }
            return true;
        })
    ,
    validatorMiddleware,
];

exports.deleteReviewValidator = [
    check('id').isMongoId().withMessage('Invalid Review id format')
        .custom(async (val, { req }) => {
            const review = await ReviewModel.findById(val);
            if (!review) {
                throw new Error(`There is no review with id ${val}`);
            }
            if (review.user._id.toString() !== req.user._id.toString()) {
                throw new Error(`Your are not allowed to perform this action`)
            }
            return true;
        })
    ,
    validatorMiddleware,
];

