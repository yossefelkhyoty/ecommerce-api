const asyncHandler = require('express-async-handler');

const UserModel = require('../models/userModel');

// @desc    Add product to wishlist
// @route   POST /api/v1/wishlist
// @access  Protected/User
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: { wishlist: req.body.productId },
        },
        { new: true }
    );
    res.status(200).json({
        status: 'Success',
        message: 'Product added successfully to your wishlist.',
        data: user.wishlist,
    })
})

// @desc    Remove product to wishlist
// @route   POST /api/v1/wishlist
// @access  Protected/User
exports.removeProductToWishlist = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        {
            $pull: { wishlist: req.params.productId },
        },
        { new: true }
    );
    res.status(200).json({
        status: 'Success',
        message: 'Product remove successfully to your wishlist.',
        data: user.wishlist,
    })
})

// @desc    Get logged user wishlist
// @route   GET /api/v1/wishlist
// @access  Protected/User

exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.user._id).populate('wishlist');

    res.status(200).json({ status: 'Success', result: user.wishlist.length, data: user.wishlist });
});