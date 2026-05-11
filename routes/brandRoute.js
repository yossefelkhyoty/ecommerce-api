const express = require('express');
const {
    getBrandValidator,
    createBrandValidator,
    updateBrandValidator,
    deleteBrandValidator
} = require('../utils/validators/brandValidator')
const {
    getBrands,
    getBrand,
    createBrand,
    updateBrand,
    deleteBrand,
    uploadBrandImage,
    relizeImage
} = require('../services/barndService')

const router = express.Router();

router
    .route('/')
    .get(getBrands)
    .post(uploadBrandImage, relizeImage, createBrandValidator, createBrand);
router
    .route('/:id')
    .get(getBrandValidator
        , getBrand)
    .put(uploadBrandImage, relizeImage, updateBrandValidator, updateBrand)
    .delete(deleteBrandValidator, deleteBrand)


module.exports = router;