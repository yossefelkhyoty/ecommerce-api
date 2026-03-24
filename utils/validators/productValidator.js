const { check } = require('express-validator');
const { default: slugify } = require('slugify');
const validatorMiddleware = require('../../middleware/validatorMiddleware');

exports.getProductVaildator = [
    check('id').isMongoId().withMessage('Inavalid ID formate'),
    validatorMiddleware,
];
exports.createProductVaildator = [
    check('title').notEmpty().withMessage('Product required.')
        .isLength({ min: 3 }).withMessage('must be at least 3 chars.')
        .isLength({ max: 100 }).withMessage('must be less than 100 chars.')
        .custom((value, { req }) => {
            req.body.slug = slugify(value);
            return true;
        }),
    check('description')
        .notEmpty().withMessage('Product Description is required')
        .isLength({ min: 20 }).withMessage('must be at least 20 chars')
        .isLength({ max: 2000 }).withMessage('must be less than 2000 chars'),
    check('quantity')
        .notEmpty().withMessage('Product Quantity is required')
        .isNumeric().withMessage('Product quantity must be a number'),
    check('sold')
        .optional()
        .isNumeric().withMessage('Product quantity must be a number'),
    check('price')
        .notEmpty().withMessage('Product Price is required')
        .isNumeric().withMessage('Product Price must be number')
        .isLength({ max: 200000 }).withMessage('Too Long Product Price'),
    check('priceAfterDiscount')
        .optional()
        .isNumeric().withMessage('Product priceAfterDiscount must be a number')
        .toFloat()
        .custom((value, { req }) => {
            if (req.body.price <= value) {
                throw new Error('priceAfterDiscount must be lower than price')
            }
            return true;
        }),
    check('color')
        .optional()
        .isArray().withMessage('Colors should be array of string'),
    check('imageCover')
        .notEmpty().withMessage('Product Image Cover is required'),
    check('images')
        .optional()
        .isArray().withMessage('Images should be array of string'),
    check('category')
        .notEmpty().withMessage('Product must be belong to a category')
        .isMongoId().withMessage('Inavlid ID formate'),
    check('subCategories')
        .optional()
        .isMongoId().withMessage('Inavlid ID formate'),
    check('brands')
        .optional()
        .isMongoId().withMessage('Inavlid ID formate'),
    check('ratingsAverage')
        .optional()
        .isNumeric().withMessage('ratings Average must be a number')
        .isLength({ min: 1 }).withMessage('Rating must be above or equal 1.0')
        .isLength({ max: 5 }).withMessage('Rating must be below or equal 5.0'),
    check('rantingsQuantity')
        .optional()
        .isNumeric().withMessage('rantings Quantity must be a number'),
    validatorMiddleware,
];
exports.updateProductVaildator = [
    check('id').isMongoId().withMessage('Inavalid ID formate'),
    validatorMiddleware,
];
exports.deleteProductVaildator = [
    check('id').isMongoId().withMessage('Inavalid ID formate'),
    validatorMiddleware,
];