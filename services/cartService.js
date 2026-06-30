const asyncHandler = require('express-async-handler');

const ApiError = require('../utils/apiError');
const ProductModel = require('../models/productModel');
const CouponModel = require('../models/couponModel');
const CartModel = require('../models/cartModel');



const calacTotalCartPrice = (cart) => {
    let totalPrice = 0;
    cart.cartItems.forEach((item) => {
        totalPrice += item.price * item.quantity;
    });
    cart.totalCartPrice = totalPrice;
    cart.totalPriceAfterDiscount = undefined;
    return totalPrice;
};

// @desc    Add product to  cart
// @route   POST /api/v1/cart
// @access  Private/User

exports.addProductToCart = asyncHandler(async (req, res, next) => {
    const { productId, color } = req.body;

    const product = await ProductModel.findById(productId);
    //1)Get Cart for logged user
    let cart = await CartModel.findOne({ user: req.user._id });
    if (!cart) {
        cart = await CartModel.create({
            user: req.user._id,
            cartItems: [{ product: productId, color, price: product.price }]
        });
    } else {
        // Product exist in cart , Update product quantity

        const productIndex = cart.cartItems.findIndex(
            (item) => item.product.toString() === productId && item.color === color
        );
        console.log(productIndex)
        if (productIndex > -1) {
            const cartItem = cart.cartItems[productIndex];
            cartItem.quantity += 1;
            cart.cartItems[productIndex] = cartItem;
        } else {
            // Product exist in cart, push product to cartItems array
            cart.cartItems.push({ product: productId, color, price: product.price });
        };
    };

    //Calaculate total cart price
    calacTotalCartPrice(cart);
    await cart.save();

    res.status(200).json({
        status: 'Success',
        message: 'Product add to cart Successfully',
        numOfCartItems: cart.cartItems.length,
        data: cart
    });

});


// @desc    Get logged user cart
// @route   GET /api/v1/cart
// @access  Private/User

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
    cart = await CartModel.findOne({ user: req.user._id });

    if (!cart) {
        return next(
            new ApiError(`There is no cart for this user id : ${req.user._id}`, 404)
        );
    }
    cart.totalPriceAfterDiscount = undefined;
    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    });
});

// @desc    Remove specific cart item
// @route   DELETE /api/v1/cart/:itemId
// @access  Private/User
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
    const cart = await CartModel.findOne({ user: req.user._id });

    if (!cart) {
        return next(new ApiError("Cart not found", 404));
    }

    const itemExists = cart.cartItems.some(
        (item) => item._id.toString() === req.params.itemId
    );

    if (!itemExists) {
        return next(new ApiError("Cart item not found", 404));
    }

    cart.cartItems.pull(req.params.itemId);

    calacTotalCartPrice(cart);
    await cart.save();

    res.status(200).json({
        status: 'Success',
        message: 'Product Remove from cart Successfully',
        numOfCartItems: cart.cartItems.length,
        data: cart
    });
});

// @desc    clear logged user cart
// @route   DELETE /api/v1/cart
// @access  Private/User
exports.clearCart = asyncHandler(async (req, res, next) => {
    await CartModel.findOneAndDelete({ user: req.user._id })
    res.status(204).send();
});

// @desc    Update specific cart item quantity
// @route   PUT /api/v1/cart/:itemId
// @access  Private/User
exports.updateCartQuantity = asyncHandler(async (req, res, next) => {

    const { quantity } = req.body;
    const cart = await CartModel.findOne({ user: req.user._id })
    if (!cart) {
        return next(
            new ApiError(`There is no cart for this user id : ${req.user._id}`, 404)
        );
    }
    const itemIndex = cart.cartItems.findIndex((item) => item._id.toString() === req.params.itemId);
    if (itemIndex > -1) {
        cartItem = cart.cartItems[itemIndex]
        cartItem.quantity = quantity;
        cart.cartItems[itemIndex] = cartItem;
    } else {
        return next(
            new ApiError(`There is no cart for this user id : ${req.params.itemId}`, 404)
        );
    }
    calacTotalCartPrice(cart);
    await cart.save();
    res.status(200).json({
        status: 'Success',
        numOfCartItems: cart.cartItems.length,
        data: cart
    });
})

// @desc    Apply coupon on logged user cart
// @route   PUT /api/v1/cart/applyCoupon
// @access  Private/User
exports.applyCoupon = asyncHandler(async (req, res, next) => {
    // 1) Get coupon based on coupon name
    const coupon = await CouponModel.findOne({
        name: req.body.coupon,
        expire: { $gt: Date.now() },
    });
    if (!coupon) {
        return next(new ApiError(`Coupon is invalid or expired`));
    };
    // 2) Get logged user cart to get total cart price
    const cart = await CartModel.findOne({ user: req.user._id });

    const totalPrice = cart.totalCartPrice;

    const totalPriceAfterDiscount = (totalPrice - (totalPrice * coupon.discount) / 100).toFixed(2);

    cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
    await cart.save();

    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    });

})