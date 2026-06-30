const express = require('express');

const { addProductToCartValidator, removeSpecificCartItemValidator, updateCartQuantityValidator, applyCouponValidator } = require('../utils/validators/cartValidator');

const {
    addProductToCart,
    getLoggedUserCart,
    removeSpecificCartItem,
    clearCart,
    updateCartQuantity,
    applyCoupon
} = require('../services/cartService');
const authService = require('../services/authService');

const router = express.Router();

router.use(authService.protect, authService.allowedTo('user'));
router
    .route('/')
    .post(addProductToCartValidator, addProductToCart)
    .get(getLoggedUserCart)
    .delete(clearCart)

router.put('/applyCoupon', applyCouponValidator, applyCoupon)

router
    .route('/:itemId')
    .delete(removeSpecificCartItemValidator, removeSpecificCartItem)
    .put(updateCartQuantityValidator, updateCartQuantity)


module.exports = router;