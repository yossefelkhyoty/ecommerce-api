const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const subCategoryModel = require('../models/subCategoryModel')
const ApiError = require('../utils/apiError');

// @des get SubCategories
// @access Public

// @Route GET /api/v1/categories/categoryId/subcategories
exports.filterObj=(req,res,next)=>{
    let filterObject = {}
    if (req.params.categoryId) filterObject = { category: req.params.categoryId }
    req.filterObj=filterObject
    next()
}

// @Route GET /api/v1/Subcategories
exports.getSubCategories = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;

    const subCategories = await subCategoryModel.find(req.filterObj).skip(skip).limit(limit);
    res.status(200).json({ result: subCategories.length, page, data: subCategories })
});


// @des get Category by id
// @Route GET /api/v1/categories/:id
// @access Public 
exports.getSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const subCategory = await subCategoryModel.findById(id);
    if (!subCategory) {
        return next(new ApiError(`No SubCategory found for this id :${id} `, 404))
    };
    res.status(200).json({ data: subCategory });
})

// @desc    Create subCategory
// @access  Private

// @route   POST  /api/v1/categories/:CategoryId/subcategories
exports.setCategoryIdToBody=(req,res,next)=>{
    if(!req.body.category) req.body.category=req.params.categoryId;
    next();
};

// @route   POST  /api/v1/subcategories
exports.createSubCategory = asyncHandler(async (req, res) => {
    const { name, category } = req.body;
    const subCategory = await subCategoryModel.create({
        name,
        slug: slugify(name),
        category,
    })
    res.status(201).json({ data: subCategory })
});

// @des Update subCategory
// @post PUT /api/v1/subcategories/:id
// @access Private

exports.updateSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, category } = req.body;
    const subCategory = await subCategoryModel.findByIdAndUpdate(
        { _id: id },
        { name, slug: slugify(name), category },
        { new: true }
    );
    if (!subCategory) {
        return next(new ApiError(`No SubCategory found for this id :${id}`, 404))
    };
    res.status(200).json({ data: subCategory })
});

// @des Delete Category
// @post DELETE /api/v1/categories/:id
// @access Private

exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const subCategory = await subCategoryModel.findByIdAndDelete({ _id: id });
    if (!subCategory) {
        return next(new ApiError(`No Category found for this id :${id} `, 404))
    };
    res.status(204).send();
})