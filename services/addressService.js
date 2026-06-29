const asyncHandler = require('express-async-handler');

const UserModel = require('../models/userModel');

// @desc    Add Address
// @route   POST /api/v1/address
// @access  Protected/User
exports.addAddress = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: { addresses: req.body },
        },
        { new: true }
    );
    res.status(200).json({
        status: 'Success',
        message: 'Address added successfully.',
        data: user.addresses,
    })
})

// @desc    Remove address
// @route   POST /api/v1/address
// @access  Protected/User
exports.removeAddress = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        {
            $pull: { addresses:{ _id:req.params.addressId }},
        },
        { new: true }
    );
    res.status(200).json({
        status: 'Success',
        message: 'Address remove successfully.',
        data: user.addresses,
    })
})

// @desc    Get logged user Address
// @route   GET /api/v1/address
// @access  Protected/User

exports.getLoggedUserAddress = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.user._id).populate('addresses');

    res.status(200).json({ status: 'Success', result: user.addresses.length, data: user.addresses });
});