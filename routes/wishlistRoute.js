const express = require('express');

const { addWishlistValidator, removeWishlistValidator } = require('../utils/validators/wishlsitValidator');
const { addProductToWishlist, removeProductToWishlist, getLoggedUserWishlist } = require('../services/wishlistService');
const authService = require('../services/authService');

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router
    .route('/')
    .post(addWishlistValidator, addProductToWishlist)
    .get(getLoggedUserWishlist)

router.delete('/:productId', removeWishlistValidator, removeProductToWishlist)



module.exports = router;