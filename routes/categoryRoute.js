const express = require('express');
const {
    getCategoryValidator,
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator
}=require('../utils/validators/categoryValidator')
const {
    getCategories,
    getCategory,
    createCategories,
    updateCategory,
    deleteCategory,
    uploadCategoryImage,
    relizeImage
} = require('../services/categoryService')
const SubcategoryRoute=require('./subCategoryRoute');

const router = express.Router();

router.use('/:categoryId/subcategories',SubcategoryRoute);

router
    .route('/')
    .get(getCategories)
    .post(uploadCategoryImage,relizeImage,createCategoryValidator,createCategories);
router
    .route('/:id')
    .get(getCategoryValidator
    ,getCategory)
    .put(uploadCategoryImage,relizeImage,updateCategoryValidator,updateCategory)
    .delete(deleteCategoryValidator,deleteCategory)


module.exports = router;