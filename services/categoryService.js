const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const CategoryModel = require('../models/categoryModel')
const ApiError = require('../utils/apiError');

// @des get Categories
// @post GET /api/v1/categories
// @access Public 
exports.getCategories = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const categories = await CategoryModel.find({}).skip(skip).limit(limit);
    res.status(200).json({ result: categories.length, page, data: categories });
});


// @des get Category by id
// @post GET /api/v1/categories/:id
// @access Public 
exports.getCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const category = await CategoryModel.findById(id);
    if (!category) {
        return next(new ApiError(`No Category found for this id :${id} `, 404))
    };
    res.status(200).json({ data: category });
});



// @des create Category
// @post POST /api/v1/categories
// @access Private 
exports.createCategories = asyncHandler(async (req, res) => {
    const {name} = req.body;
    const category = await CategoryModel.create({
        name,
        slug: slugify(name)
    });
    res.status(201).json({ data: category });
});


// @des Update Category
// @post PUT /api/v1/categories/:id
// @access Private

exports.updateCategory = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    const { name } = req.body;
    const category = await CategoryModel.findByIdAndUpdate(
        { _id: id },
        { name, slug: slugify(name) },
        { new: true }
    );
    if (!category) {
        return next(new ApiError(`No Category found for this id :${id} `, 404))
    };
    res.status(200).json({ data: category });
});


// @des Delete Category
// @post DELETE /api/v1/categories/:id
// @access Private

exports.deleteCategory = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    const category = await CategoryModel.findByIdAndDelete({ _id: id });
    if (!category) {
        return next(new ApiError(`No Category found for this id :${id} `, 404))
    };
    res.status(204).send();
})

