const express = require('express');

const { addAddressValidator, removeAdressValidator } = require('../utils/validators/addressVaildator');
const { addAddress, removeAddress, getLoggedUserAddress } = require('../services/addressService');
const authService = require('../services/authService');

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router
    .route('/')
    .post(addAddressValidator, addAddress)
    .get(getLoggedUserAddress)

router.delete('/:addressId', removeAdressValidator, removeAddress)



module.exports = router;