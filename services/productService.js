/* eslint-disable node/no-unsupported-features/es-syntax */
const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const ProductModel = require('../models/productModel')
const ApiError = require('../utils/apiError');


// @des get Products
// @post GET /api/v1/Products
// @access Public 
exports.getProducts = asyncHandler(async (req, res) => {

    //1) Filtering
    const queryStringObj = { ...req.query };
    const excluadesFields = ['page', 'sort', 'limit', 'fields','keyword'];
    excluadesFields.forEach((field) => delete queryStringObj[field]);

    //Apply filteration using [gte,gt,lte,lt]
    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    const filterConditions = JSON.parse(queryStr);

    //2) Serach
    if(req.query.keyword){
            filterConditions.$or= [
            {title:{$regex:req.query.keyword,$options:'i'}},
            {description:{$regex:req.query.keyword,$options:'i'}},
        ];
    }

    //3) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 50;
    const skip = (page - 1) * limit;


    //Bulid query
    let mongooseQuery = ProductModel.find(filterConditions)
        .skip(skip)
        .limit(limit)
        .populate({ path: 'category', select: 'name -_id' });

    //4) Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        mongooseQuery = mongooseQuery.sort(sortBy);
    } else {
        mongooseQuery = mongooseQuery.sort("-createdAt")
    }

    //5) Fielding
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        mongooseQuery = mongooseQuery.select(fields);
    } else {
        mongooseQuery = mongooseQuery.select('-__v');
    }


    //Execute query
    const products = await mongooseQuery;

    res.status(200).json({ result: products.length, page, data: products });
});


// @des get Product by id
// @post GET /api/v1/Products/:id
// @access Public 
exports.getProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const product = await ProductModel.findById(id).populate({ path: 'category', select: 'name -_id' });
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
    if (req.body.title) {
        req.body.slug = slugify(req.body.title);
    }
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

