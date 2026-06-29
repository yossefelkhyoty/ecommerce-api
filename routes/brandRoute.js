const express = require('express');
const {
    getBrandValidator,
    createBrandValidator,
    updateBrandValidator,
    deleteBrandValidator
} = require('../utils/validators/brandValidator');
const {
    getBrands,
    getBrand,
    createBrand,
    updateBrand,
    deleteBrand,
    uploadBrandImage,
    relizeImage
} = require('../services/barndService');
const authService = require('../services/authService');

const router = express.Router();

router
    .route('/')
    .get(getBrands)
    .post(
        authService.protect,
        authService.allowedTo("admin", "manager"),
        uploadBrandImage,
        relizeImage,
        createBrandValidator,
        createBrand
    );
router
    .route('/:id')
    .get(getBrandValidator, getBrand)
    .put(
        authService.protect,
        authService.allowedTo("admin", "manager"),
        uploadBrandImage,
        relizeImage,
        updateBrandValidator,
        updateBrand
    )
    .delete(
        authService.protect,
        authService.allowedTo("admin"),
        deleteBrandValidator,
        deleteBrand
    );


module.exports = router;