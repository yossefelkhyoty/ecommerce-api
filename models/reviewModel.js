const mongoose = require('mongoose');
const ProductModel = require('./productModel');

const reviewSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    ratings: {
        type: Number,
        min: [1, 'Min ratings value is 1.0'],
        max: [5, 'Max ratings value is 5.0'],
        required: [true, 'Rating required'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to user'],
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'Review must belong to product'],
    },
},
    { timestamps: true }
);

reviewSchema.index(
    { user: 1, product: 1 },
    { unique: true }
);

reviewSchema.pre(/^find/, function (next) {
    this.populate({ path: 'user', select: 'name' });
})


reviewSchema.statics.calcAvgRatingsAndQuantity = async function (productId) {
    const result = await this.aggregate([
        {
            $match: { product: productId },
        },
        {
            $group: {
                _id: '$product',
                avgRatings: { $avg: '$ratings' },
                ratingsQuantity: { $sum: 1 },
            },
        },
    ]);

    if (result.length > 0) {
        await ProductModel.findByIdAndUpdate(productId, {
            ratingsAverage: result[0].avgRatings,
            rantingsQuantity: result[0].ratingsQuantity,
        })
    } else {
        await ProductModel.findByIdAndUpdate(productId, {
            ratingsAverage: 0,
            rantingsQuantity: 0,
        });
    };

};

reviewSchema.post('save', async function () {
    await this.constructor.calcAvgRatingsAndQuantity(this.product)
});

module.exports = mongoose.model('Review', reviewSchema);