const express = require('express');

const { createCashOrder, getAllOrder, filterOrderForLoggedUser, getSpecificOrder, updateOrderToPaid, updateOrderToDelivered, checkoutSession } = require('../services/orderService');
const authService = require('../services/authService');

const router = express.Router();

router.use(authService.protect);

router.get('/checkout-session/:cartId', checkoutSession)

router.get('/', authService.allowedTo('user', 'admin', 'manager'), filterOrderForLoggedUser, getAllOrder);
router.get('/:id', getSpecificOrder)

router
    .route('/:cartId')
    .post(createCashOrder);


router.put('/:id/pay', authService.allowedTo('admin', 'manager'), updateOrderToPaid);
router.put('/:id/deliver', authService.allowedTo('admin', 'manager'), updateOrderToDelivered);
module.exports = router;
