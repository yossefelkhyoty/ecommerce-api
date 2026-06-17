const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: [3, 'Too short Product Title'],
        maxLength: [100, 'Too long Product Title'],
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: [true, 'Product Description is required'],
        minLength: [20, 'Too Short Product Description'],
    },
    quantity: {
        type: Number,
        required: [true, 'Product Quantity is required'],
    },
    sold: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, 'Product Price is required'],
        min: [0, 'Price must be positive'],
        max: [200000, 'Too Long Product Price']
    },
    priceAfterDiscount: {
        type: Number,
    },
    color: [String],
    imageCover: {
        type: String,
        required: [true, 'Product Image Cover is required'],
    },
    images: [String],
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Product Category is required'],
    },
    subCategories: [{
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory',
    }],
    brands: {
        type: mongoose.Schema.ObjectId,
        ref: 'Brands',
    },
    ratingsAverage: {
        type: Number,
        min: [1, 'Rating must be above or equal 1.0'],
        max: [5, 'Rating must be below or equal 5.0'],
    },
    rantingsQuantity: {
        type: Number,
        default: 0,
    },

}, { timestamps: true });


productSchema.pre(/^find/, function () {
    this.populate({
        path: "category",
        select: "name-_id"
    })
})


const setImageUrl = (doc) => {
    if (doc.imageCover) {
        const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
        doc.imageCover = imageUrl;
    }
    if (doc.images) {
        const imageList = [];
        doc.images.forEach((image) => {
            const imageUrl = `${process.env.BASE_URL}/products/${image}`;
            imageList.push(imageUrl);
        });
        doc.images = imageList
    }
};

//FindOne,FindAll and Update
productSchema.post('init', (doc => {
    setImageUrl(doc);
}));

//Create
productSchema.post('save', (doc => {
    setImageUrl(doc);
}));


module.exports = mongoose.model('Product', productSchema);