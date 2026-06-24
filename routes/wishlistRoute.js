const express = require('express');

const { addWishlistValidator, removeWishlistValidator } = require('../utils/validators/wishlsitValidator');
const { addProductToWishlist, removeProductToWishlist, getLoggedUserWishlist } = require('../services/wishlistServices');
const authService = require('../services/authServices');

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router
    .route('/')
    .post(addWishlistValidator, addProductToWishlist)
    .get(getLoggedUserWishlist)

router.delete('/:productId', removeWishlistValidator, removeProductToWishlist)



module.exports = router;