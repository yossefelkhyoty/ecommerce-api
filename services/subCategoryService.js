const SubCategoryModel = require('../models/subCategoryModel')
const handlerFactory = require("./handlersFactory");


// Nested route (Create)
// @route   POST  /api/v1/categories/:CategoryId/subcategories
exports.setCategoryIdToBody = (req, res, next) => {
    if (!req.body.category) req.body.category = req.params.categoryId;
    next();
};

// Nested route
// @Route GET /api/v1/categories/categoryId/subcategories
exports.filterObj = (req, res, next) => {
    let filterObject = {}
    if (req.params.categoryId) filterObject = { category: req.params.categoryId }
    req.filterObj = filterObject
    next()
}

// @Route GET /api/v1/Subcategories
exports.getSubCategories = handlerFactory.getAll(SubCategoryModel);

// @des get Category by id
// @Route GET /api/v1/categories/:id
// @access Public 

exports.getSubCategory = handlerFactory.getOne(SubCategoryModel);

// @route   POST  /api/v1/subcategories
exports.createSubCategory = handlerFactory.createOne(SubCategoryModel);

// @des Update subCategory
// @post PUT /api/v1/subcategories/:id
// @access Private
exports.updateSubCategory = handlerFactory.updateOne(SubCategoryModel);

// @des Delete Category
// @post DELETE /api/v1/categories/:id
// @access Private
exports.deleteSubCategory = handlerFactory.deleteOne(SubCategoryModel);