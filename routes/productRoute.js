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
    deleteProduct
} = require('../services/productService')

const router = express.Router();

router
    .route('/')
    .get(getProducts)
    .post(createProductVaildator, createProducts);
router
    .route('/:id')
    .get(getProductVaildator
        , getProduct)
    .put(updateProductVaildator, updateProduct)
    .delete(deleteProductVaildator, deleteProduct)


module.exports = router;