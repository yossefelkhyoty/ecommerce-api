const crypto = require('crypto');

const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

const ApiError = require('../utils/apiError');
const sendEmail = require('../utils/sendEmail');
const createToken=require('../utils/createToken');

const UserModel = require('../models/userModel');

// @des signup
// @post GET /api/v1/auth/signup
// @access Public 
exports.signup = asyncHandler(async (req, res, next) => {
    //1-Create user
    const user = await UserModel.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    //2-Generate token
    const token = createToken(user._id);

    res.status(201).json({ data: user, token });

});

// @des login
// @post GET /api/v1/auth/login
// @access Public 
exports.login = asyncHandler(async (req, res, next) => {
    //1-Check if user exist & Check if password is correct
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError('Incorrect password or email', 401));
    }
    //2-Generate token
    const token = createToken(user._id);

    res.status(200).json({ data: user, token });

})

// @des make sure the user logged in
exports.protect = asyncHandler(async (req, res, next) => {
    //1- check if token exist , if exist get
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(new ApiError('You are not login,please login to get access this route ', 401));
    }

    //2-Verfiy token (no change happens, expired token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    //3- Check if user exist
    const currentUser = await UserModel.findById(decoded.userId);
    if (!currentUser) {
        return next(new ApiError('The user that belong to this token does no longer exist ', 401));
    }

    //4-Password changed after token created
    if (currentUser.passwordChangedAt) {
        const passChngedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
        //Password changed after token created (Error)
        if (passChngedTimestamp > decoded.iat) {
            return next(new ApiError('User recently changed his password. please login again..', 401));
        };
    };
    req.user = currentUser;
    next();
});

// @des Authorization (User Permission)
//["admin","manager"]
exports.allowedTo = (...roles) =>
    asyncHandler(async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ApiError('Your are not allowed to access this route ', 403)
            );
        };
        next();
    });


// @des forgetPassword
// @post GET /api/v1/auth/forgetPassword
// @access Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
    //1-Get user by email
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
        return next(
            new ApiError(`there is no user with this email  ${req.body.email}`, 404)
        );
    };
    //2- If user exist , generate hash rest random 6 digits and save it in db 
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashResetCode = crypto
        .createHash('sha256')
        .update(resetCode)
        .digest('hex');

    //Save hash password rest code  into db

    user.passwordResetCode = hashResetCode;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    user.passwordVerified = false;

    await user.save();

    //3-Send Email
    const message = `Hi ${user.name},

We received a request to reset your Design Club password.
Your verification code is:

    ${resetCode}

This code will expire in 10 minutes.
If you didn't request this, you can safely ignore this email.

Best regards,
The Design Club Team`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your Password reset code (vaild for 10 min) ',
            message,
        });
    } catch (error) {
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordVerified = undefined;

        await user.save();
        return next(new ApiError('There is an error in sending email', 400));
    };
    res.status(200).json({ status: "Success", message: "Rest Code Send To Email" });
});


// @des VerifyResetCode
// @post GET /api/v1/auth/verifyResetCode
// @access Public
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
    //1-Get user based on reset code
    const hashResetCode = crypto
        .createHash('sha256')
        .update(req.body.resetCode)
        .digest('hex');

    const user = await UserModel.findOne({
        passwordResetCode: hashResetCode,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
        return next(new ApiError(('Reset code Invaild or expire'), 400));
    };
    //2-Reset code vaild
    user.passwordVerified = true;
    await user.save();
    res.status(200).json({
        status: 'Success'
    });
});

// @des Reset Password
// @post GET /api/v1/auth/resetPassword
// @access Public

exports.resetPassword = asyncHandler(async (req, res, next) => {
    //1-Get User based on email
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError(`There is no User with email ${req.body.email}`, 400));
    }
    //2-Check if reset code verified
    if (!user.passwordVerified) {
        return next(new ApiError(`Reset code not verified`, 400));
    }

    user.password = req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordVerified = undefined;

    await user.save();

    //3-Generate token
    const token = createToken(user._id);
    res.status(200).json({token})
});