const express = require('express');
const {
    getReviewValidator,
    createReviewValidator,
    updateReviewValidator,
    deleteReviewValidator
} = require('../utils/validators/reviewVaildator');
const {
    getReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview,
    setProductIdAndUserIdToBody,
    filterObj
} = require('../services/reviewServices');

const authService = require('../services/authService');

const router = express.Router({mergeParams:true});

router
    .route('/')
    .get(filterObj,getReviews)
    .post(authService.protect, authService.allowedTo("user"), setProductIdAndUserIdToBody,createReviewValidator, createReview);
router
    .route('/:id')
    .get(getReviewValidator, getReview)
    .put(authService.protect, authService.allowedTo("user"), updateReviewValidator, updateReview)
    .delete(authService.protect, authService.allowedTo("user", "admin", "manager"), deleteReviewValidator, deleteReview);


module.exports = router;