const { default: slugify } = require('slugify');
const { check, body } = require('express-validator');
const bcrypt = require('bcryptjs')
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const UserModel = require("../../models/userModel");

exports.getUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    validatorMiddleware,
];

exports.createUserValidator = [
    check('name')
        .notEmpty()
        .withMessage("User is Required")
        .isLength({ min: 3 })
        .withMessage("Mnimum 3 characters allowed.")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check('email')
        .notEmpty()
        .withMessage("Email Required")
        .isEmail().withMessage("Invalid email address")
        .custom((val) => UserModel.findOne({ email: val }).then((user) => {
            if (user) {
                return Promise.reject(new Error("E-mail already in user"));
            }
        })),
    check('password')
        .notEmpty()
        .withMessage('Password required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .custom((password, { req }) => {
            if (password !== req.body.passwordConfirm) {
                throw new Error('Password Confirmation incorrect');
            }
            return true;
        }),
    check('passwordConfirm')
        .notEmpty()
        .withMessage('Password confirmation required'),
    check('phone')
        .optional().isMobilePhone(['ar-EG'])
        .withMessage('Invalid mobile phone number'),
    check('profileImg').optional(),
    check('role').optional(),
    validatorMiddleware,
];

exports.changeUserPasswordValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    check('currentPassword').notEmpty().withMessage('You must enter your current password'),
    check('passwordConfirm').notEmpty().withMessage('You must enter password confirm'),
    check('password')
        .notEmpty()
        .withMessage('You must enter new password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .custom(async (password, { req }) => {
            //1)current password
            const user = await UserModel.findById(req.params.id);
            if (!user) {
                throw new Error('There is no user for this id');
            }
            const isCorrectPassword = await bcrypt.compare(req.body.currentPassword, user.password);
            if (!isCorrectPassword) {
                throw new Error('incorrect current password');
            }
            //2)password confirm
            if (password !== req.body.passwordConfirm) {
                throw new Error('Password Confirmation incorrect');
            }
            return true;
        }),
    validatorMiddleware,
];
exports.updateUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    body('name').optional().custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    check('email')
        .optional()
        .isEmail().withMessage("Invalid email address")
        .custom((val) => UserModel.findOne({ email: val }).then((user) => {
            if (user) {
                return Promise.reject(new Error("E-mail already in user"));
            }
        })),
    check('phone')
        .optional().isMobilePhone(['ar-EG'])
        .withMessage('Invalid mobile phone number'),
    check('profileImg').optional(),
    check('role').optional(),
    validatorMiddleware,
];

exports.deleteUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    validatorMiddleware,
];



exports.updateLoggedUserValidator = [
    body('name').optional().custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    check('email')
        .optional()
        .isEmail().withMessage("Invalid email address")
        .custom((val) => UserModel.findOne({ email: val }).then((user) => {
            if (user) {
                return Promise.reject(new Error("E-mail already in user"));
            }
        })),
    check('phone')
        .optional().isMobilePhone(['ar-EG'])
        .withMessage('Invalid mobile phone number'),
    check('profileImg').optional(),
    validatorMiddleware,
];


