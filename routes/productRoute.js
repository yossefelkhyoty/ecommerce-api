const express = require('express');
const {
    getProductVaildator,
    createProductVaildator,
    updateProductVaildator,
    deleteProductVaildator
} = require('../utils/validators/productValidator')
const {
    getProducts,
    getProduct,
    createProducts,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    relizeProductImages
} = require('../services/productService')
const authService = require('../services/authService');
const reviewRoute = require('./reviewRoute');


const router = express.Router();

router.use('/:productId/reviews', reviewRoute);

router
    .route('/')
    .get(getProducts)
    .post(
        authService.protect,
        authService.allowedTo("admin", "manager"),
        uploadProductImages,
        relizeProductImages,
        createProductVaildator,
        createProducts
    );
router
    .route('/:id')
    .get(getProductVaildator
        , getProduct)
    .put(
        authService.protect,
        authService.allowedTo("admin", "manager"),
        uploadProductImages,
        relizeProductImages,
        updateProductVaildator,
        updateProduct
    )
    .delete(
        authService.protect,
        authService.allowedTo("admin"),
        deleteProductVaildator,
        deleteProduct
    );


module.exports = router;