const express = require('express');
const {
    createSubCategoryValidator,
    getSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator
}
    = require('../utils/validators/subCategoryValidator')
const {
    createSubCategory,
    getSubCategories,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory,
    setCategoryIdToBody,
    filterObj
} = require('../services/subCategoryService');

const router = express.Router({ mergeParams: true });


router
    .route('/')
    .get(filterObj, getSubCategories)
    .post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory)


router
    .route('/:id')
    .get(getSubCategoryValidator, getSubCategory)
    .put(updateSubCategoryValidator, updateSubCategory)
    .delete(deleteSubCategoryValidator, deleteSubCategory)
module.exports = router;