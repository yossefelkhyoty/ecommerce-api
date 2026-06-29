const handlerFactory = require("./handlersFactory")
const CouponModel = require('../models/couponModel')

// @des get Coupons
// @post GET /api/v1/coupons
// @access Private/Admin-Manager 
exports.getCoupons = handlerFactory.getAll(CouponModel);

// @des get Coupon by id
// @post GET /api/v1/coupons/:id
// @access Private/Admin-Manager 
exports.getCoupon = handlerFactory.getOne(CouponModel);

// @des create Coupon
// @post POST /api/v1/coupons
// @access Private/Admin-Manager 
exports.createCoupon = handlerFactory.createOne(CouponModel);

// @des Update Coupon
// @post PUT /api/v1/coupons/:id
// @access Private/Admin-Manager
exports.updateCoupon = handlerFactory.updateOne(CouponModel);

// @des Delete Coupon
// @post DELETE /api/v1/coupons/:id
// @access Private/Admin-Manager
exports.deleteCoupon = handlerFactory.deleteOne(CouponModel);
