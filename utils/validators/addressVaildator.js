const { check } = require('express-validator');
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const UserModel = require('../../models/userModel');

exports.addAddressValidator = [
    check('alias')
        .notEmpty()
        .withMessage('Address alias is required')
        .custom(async (val, { req }) => {
            const user = await UserModel.findById(req.user._id);
            const exist = user.addresses.some(
                (address) => address.alias.toLowerCase() === val.toLowerCase()
            );
            if (exist) {
                throw new Error('Address alias already exists');
            }
            return true;
        }),

    check('details')
        .notEmpty()
        .withMessage('Address details are required'),

    check('phone')
        .notEmpty()
        .withMessage('Phone is required')
        .isMobilePhone(['ar-EG'])
        .withMessage('Invalid phone number'),

    check('city')
        .notEmpty()
        .withMessage('City is required'),

    check('postalCode')
        .optional()
        .isPostalCode('any')
        .withMessage('Invalid postal code'),


    validatorMiddleware,
];

exports.removeAdressValidator = [
    check('addressId')
        .isMongoId()
        .withMessage('Invalid address id format'),
    validatorMiddleware,
];