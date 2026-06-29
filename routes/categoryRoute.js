const express = require('express');
const {
    getCategoryValidator,
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator
} = require('../utils/validators/categoryValidator')
const {
    getCategories,
    getCategory,
    createCategories,
    updateCategory,
    deleteCategory,
    uploadCategoryImage,
    relizeImage
} = require('../services/categoryService')

const authService = require('../services/authService');
const SubcategoryRoute = require('./subCategoryRoute');

const router = express.Router();

router.use('/:categoryId/subcategories', SubcategoryRoute);

router
    .route('/')
    .get(getCategories)
    .post(
        authService.protect,
        authService.allowedTo("admin", "manager"),
        uploadCategoryImage,
        relizeImage,
        createCategoryValidator,
        createCategories
    );
router
    .route('/:id')
    .get(
        getCategoryValidator,
        getCategory
    )
    .put(
        authService.protect,
        authService.allowedTo("admin", "manager"),
        uploadCategoryImage,
        relizeImage,
        updateCategoryValidator,
        updateCategory
    )
    .delete(
        authService.protect,
        authService.allowedTo("admin"),
        deleteCategoryValidator, deleteCategory
    );


module.exports = router;