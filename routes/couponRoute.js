const express = require('express');
const {
    getCouponValidator,
    createCouponValidator,
    updateCouponValidator,
    deleteCouponValidator
} = require('../utils/validators/couponValidator');
const {
    getCoupon,
    getCoupons,
    createCoupon,
    deleteCoupon,
    updateCoupon
} = require('../services/couponService');
const authService = require('../services/authService');

const router = express.Router();

router.use(authService.protect, authService.allowedTo("admin", "manager"));

router
    .route('/')
    .get(getCoupons)
    .post(createCouponValidator, createCoupon);
router
    .route('/:id')
    .get(getCouponValidator, getCoupon)
    .put(updateCouponValidator, updateCoupon)
    .delete(deleteCouponValidator, deleteCoupon);


module.exports = router;