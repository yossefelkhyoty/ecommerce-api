const asyncHandler = require('express-async-handler');

const handlerFactory = require("./handlersFactory");
const ReviewModel = require('../models/reviewModel');


// Nested route
// @Route GET /api/v1/reviews/ProductId/subReviews
exports.filterObj = (req, res, next) => {
    let filterObject = {}
    if (req.params.productId) filterObject = { product: req.params.productId }
    req.filterObj = filterObject
    next()
}

// @des get Reviews
// @post GET /api/v1/reviews
// @access Public 
exports.getReviews = handlerFactory.getAll(ReviewModel);

// @des get review by id
// @post GET /api/v1/reviews/:id
// @access Public 
exports.getReview = handlerFactory.getOne(ReviewModel);


// Nested route (Create)
// @route   POST  /api/v1/reviews/:ProductId/subReviews
exports.setProductIdAndUserIdToBody = (req, res, next) => {
    if (!req.body.product) req.body.product = req.params.productId;
    if (!req.body.user) req.body.user = req.params.userId;
    next();
};

// @des create review
// @post POST /api/v1/reviews
// @access Private/Protect/User 
exports.createReview = asyncHandler(async (req, res) => {
    // inject user from JWT
    req.body.user = req.user._id;

    const review = await ReviewModel.create(req.body);

    res.status(201).json({
        data: review
    });
});

// @des Update review
// @post PUT /api/v1/reviews/:id
// @access Private/Protect/User
exports.updateReview = handlerFactory.updateOne(ReviewModel);

// @des Delete review
// @post DELETE /api/v1/reviews/:id
// @access Private/Protect/User-Admin-Manager
exports.deleteReview = handlerFactory.deleteOne(ReviewModel);
