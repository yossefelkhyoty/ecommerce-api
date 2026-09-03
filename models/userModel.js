const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'name required']
    },
    slug: {
        type: String,
        lowercase: true,
    },
    email: {
        type: String,
        required: [true, 'email required'],
        unique: true,
        lowercase: true,
    },
    passwordChangedAt: Date,
    passwordResetCode: {
        type: String,
        select: false,
    },
    passwordResetExpires: Date,
    passwordVerified: Boolean,
    phone: String,
    profileImg: String,

    password: {
        type: String,
        required: [true, 'password required'],
        minLength: [6, 'Too Short password'],
        select: false,
    },
    role: {
        type: String,
        enum: ['user', 'manager', 'admin'],
        default: 'user',
    },
    active: {
        type: Boolean,
        default: true,
    },
    wishlist: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Product'
        },
    ],
    addresses: [
        {
            alias: String,
            details: String,
            phone: String,
            city: String,
            postalCode: String,
        },
    ],
}, { timestamps: true });


userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
})

module.exports = mongoose.model('User', userSchema);