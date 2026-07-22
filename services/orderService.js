const stripe = require('stripe')(process.env.STRIPE_SECRET);
const asyncHandler = require('express-async-handler');

const handlerFactory = require("./handlersFactory");
const ApiError = require('../utils/apiError');

const OrderModel = require('../models/orderModel');
const ProductModel = require('../models/productModel');
const UserModel = require('../models/userModel');
const CartModel = require('../models/cartModel');


//@desc     create cash order
//@rourte   POST/api/v1/orders/cardId
//@access   Protected/User
exports.createCashOrder = asyncHandler(async (req, res, next) => {
    const shippingPrice = 0;
    const taxPrice = 0;

    //1) Get cart depend on cardId
    const cart = await CartModel.findById(req.params.cartId);
    if (!cart) {
        return next(
            new ApiError(`There is no such cart with id ${req.params.cartId}`, 404)
        );
    };
    // 2) Get order price depend on cart price "Check if coupon apply" 
    const cartPrice = cart.totalPriceAfterDiscount
        ? cart.totalPriceAfterDiscount
        : cart.totalCartPrice;

    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
    const user = await UserModel.findById(req.user._id)
    // 3) Get shipping address from user's saved addresses
    let shippingAddress;

    if (req.body.addressId) {
        shippingAddress = user.addresses.id(req.body.addressId);
        if (!shippingAddress) {
            return next(new ApiError("Address not found", 404));
        }
    } else if (req.body.shippingAddress) {
        // eslint-disable-next-line prefer-destructuring
        shippingAddress = req.body.shippingAddress;
        if (req.body.saveAddress) {
            user.addresses.push(shippingAddress);
            await user.save();
        }
    } else {
        return next(
            new ApiError(
                "Please provide addressId or shippingAddress",
                400
            )
        );
    }
    // 4) Create order with default paymentMethodType cash
    const order = await OrderModel.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        shippingAddress: {
            details: shippingAddress.details,
            phone: shippingAddress.phone,
            city: shippingAddress.city,
            postalCode: shippingAddress.postalCode,
        },
        totalOrderPrice
    });
    // 5) After creating order, decrement product quantity, increment product sold
    if (order) {

        const bulkOptions = cart.cartItems.map(item => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
            },
        }));
        await ProductModel.bulkWrite(bulkOptions);
        // 6) Clear cart depend on cartId
        await CartModel.findByIdAndDelete(req.params.cartId);
    };
    res.status(201).json({ status: 'Success', data: order })
});

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
    if (req.user.role === "user") req.filterObj = { user: req.user._id };
    next();
})

//@desc     Get all order
//@rourte   POST/api/v1/orders
//@access   Protected/User-Admin-Manager
exports.getAllOrder = handlerFactory.getAll(OrderModel);


// @desc    Get Specific order
// @route   POST /api/v1/orders/:id
// @access  Protected/User-Admin-Manager
exports.getSpecificOrder = asyncHandler(async (req, res, next) => {
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
        return next(new ApiError(`Order not found`, 404));
    };
    if (req.user.role === 'user' &&
        order.user._id.toString() !== req.user._id.toString()
    ) {
        return next(new ApiError("You are not allowed to access this order", 403));
    }
    res.status(200).json({
        Status: 'Success',
        Date: order
    });
})


// @desc    Update order paid status
// @route   PUT /api/v1/orders/:id/pay
// @access  Protected/Admin-Manager
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
        return next(new ApiError(`There is no such a order with this id:${req.params.id}`, 404));
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    const updateOrder = await order.save();
    res.status(200).json({ status: 'success', date: updateOrder });
});


// @desc    Update order deliver status
// @route   PUT /api/v1/orders/:id/deliver
// @access  Protected/Admin-Manager
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
        return next(new ApiError(`There is no such a order with this id:${req.params.id}`, 404));
    }
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updateOrder = await order.save();
    res.status(200).json({ status: 'success', date: updateOrder });
});

// @desc    Get checkout session from stripe and send it as response
// @route   GET /api/v1/orders/checkout-session/cartId
// @access  Protected/User
exports.checkoutSession = asyncHandler(async (req, res, next) => {
    // app settings
    const taxPrice = 0;
    const shippingPrice = 0;

    //1)Get cart depend on cartId
    const cart = await CartModel.findById(req.params.cartId)
    if (!cart) {
        return next(
            new ApiError(`There is no such cart with id ${req.params.cartId}`, 404)
        );
    };
    // 2) Get order price depend on cart price "Check if coupon apply" 
    const cartPrice = cart.totalPriceAfterDiscount
        ? cart.totalPriceAfterDiscount
        : cart.totalCartPrice;

    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'egp',
                    product_data: {
                        name: `order for ${req.user.name}`,
                    },
                    unit_amount: totalOrderPrice * 100,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/orders`,
        cancel_url: `${req.protocol}://${req.get('host')}/cart`,
        customer_email: req.user.email,
        client_reference_id: req.params.cartId,
        metadata: req.body.shippingAddress,
    });
    res.status(200).json({ status: 'success', session });
});

const createCardOrder = async (session) => {
    const cartId = session.client_reference_id;
    const shippingAddress = session.metadata;
    const orderPrice = session.amount_total / 100;

    const cart = await CartModel.findById(cartId);
    const user = await UserModel.findOne({ email: session.customer_email });

    // 4) Create order with default paymentMethodType Card
    const order = await OrderModel.create({
        user: user._id,
        cartItems: cart.cartItems,
        shippingAddress,
        totalOrderPrice: orderPrice,
        isPaid: true,
        paidAt: Date.now(),
        paymentMethodType: 'card',
    });

    // 5) After creating order, decrement product quantity, increment product sold
    if (order) {

        const bulkOptions = cart.cartItems.map(item => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
            },
        }));
        await ProductModel.bulkWrite(bulkOptions);
        // 6) Clear cart depend on cartId
        await CartModel.findByIdAndDelete(cartId);
    };
}


// @desc    This webhook will run when stripe payment success paid
// @route   POST /api/v1/webhook-checkout
// @access  Protected/User
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
    let event = req.body;

    const signature = req.headers['stripe-signature'];
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === "checkout.session.completed") {
        createCardOrder(event.data.object)
    }
    res.status(200).json({ received: true });
});