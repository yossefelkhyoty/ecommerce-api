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

const router = express.Router();

router
    .route('/')
    .get(getProducts)
    .post(uploadProductImages,relizeProductImages,createProductVaildator, createProducts);
router
    .route('/:id')
    .get(getProductVaildator
        , getProduct)
    .put(uploadProductImages,relizeProductImages,updateProductVaildator, updateProduct)
    .delete(deleteProductVaildator, deleteProduct)


module.exports = router;