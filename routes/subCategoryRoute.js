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
const authService = require('../services/authServices');

const router = express.Router({ mergeParams: true });


router
    .route('/')
    .get(filterObj, getSubCategories)
    .post(
        authService.protect,
        authService.allowedTo("admin", "manager"),
        setCategoryIdToBody,
        createSubCategoryValidator,
        createSubCategory
    )


router
    .route('/:id')
    .get(getSubCategoryValidator, getSubCategory)
    .put(
        authService.protect,
        authService.allowedTo("admin", "manager"),
        updateSubCategoryValidator,
        updateSubCategory
    )
    .delete(
        authService.protect,
        authService.allowedTo("admin"),
        deleteSubCategoryValidator,
        deleteSubCategory
    );
    
module.exports = router;