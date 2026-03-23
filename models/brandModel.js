const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category is Required'],
        unique: [true, 'Category must be unique'],
        minLength: [3, 'Too short name category name'],
        maxLength: [32, 'Too long name category name'],
    },
    slug: {
        type: String,
        lowercase: true,
    },
    image: String,

}, { timestamps: true });

module.exports = mongoose.model('Barnds', brandSchema);