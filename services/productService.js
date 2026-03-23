const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const ProductModel = require('../models/productModel')
const ApiError = require('../utils/apiError');

// @des get Products
// @post GET /api/v1/Products
// @access Public 
exports.getProducts = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const products = await ProductModel.find({}).skip(skip).limit(limit);
    res.status(200).json({ result: products.length, page, data: products });
});


// @des get Product by id
// @post GET /api/v1/Products/:id
// @access Public 
exports.getProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const product = await ProductModel.findById(id);
    if (!product) {
        return next(new ApiError(`No product found for this id :${id} `, 404))
    };
    res.status(200).json({ data: product });
});



// @des create Product
// @post POST /api/v1/Products
// @access Private 
exports.createProducts = asyncHandler(async (req, res) => {
    req.body.slug = slugify(req.body.title);
    const product = await ProductModel.create(req.body);
    res.status(201).json({ data: product });
});


// @des Update Product
// @post PUT /api/v1/Products/:id
// @access Private

exports.updateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    req.body.slug = slugify(req.body.title);
    const product = await ProductModel.findByIdAndUpdate(
        { _id: id },
        req.body,
        { new: true }
    );
    if (!product) {
        return next(new ApiError(`No Product found for this id :${id} `, 404))
    };
    res.status(200).json({ data: product });
});


// @des Delete product
// @post DELETE /api/v1/Products/:id
// @access Private

exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const product = await ProductModel.findByIdAndDelete({ _id: id });
    if (!product) {
        return next(new ApiError(`No Product found for this id :${id} `, 404))
    };
    res.status(204).send();
})

