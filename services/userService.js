const path = require('path');
const fs = require('fs');

const { v4: uuidv4 } = require("uuid");
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

const handlerFactory = require("./handlersFactory");
const ApiError = require('../utils/apiError');
const { uploadSingleImage } = require('../middleware/uploadImageMiddleware');
const createToken = require('../utils/createToken');
const UserModel = require('../models/userModel');


// ensure upload directory exists
const dir = path.join(__dirname, '../uploads/users');

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

//Upload Single Image
exports.uploadUserImage = uploadSingleImage('profileImg');

//Image Prcessing
exports.relizeImage = asyncHandler(async (req, res, next) => {

    if (!req.file) return next();

    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(path.join(dir, filename));
    //Save image into DB
    req.body.profileImg = filename;

    next();

});

// @des get users
// @post GET /api/v1/users
// @access Private 
exports.getUsers = handlerFactory.getAll(UserModel);

// @des get User by id
// @post GET /api/v1/users/:id
// @access Private 
exports.getUser = handlerFactory.getOne(UserModel);

// @des create User
// @post POST /api/v1/users
// @access Private 
exports.createUser = handlerFactory.createOne(UserModel);

// @des Update User
// @post PUT /api/v1/users/:id
// @access Private
exports.updateUser = asyncHandler(async (req, res, next) => {
    const document = await UserModel.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            slug: req.body.slug,
            phone: req.body.phone,
            email: req.body.email,
            profileImg: req.body.profileImg,
            role: req.body.role,
        },
        { new: true }
    );
    if (!document) {
        return next(new ApiError(`No document found for this id :${id} `, 404))
    };
    res.status(200).json({ data: document });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
    const document = await UserModel.findByIdAndUpdate(
        req.params.id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        },
        {
            new: true,
        }
    );

    if (!document) {
        return next(new ApiError(`No document for this id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: document });
});


// @des Delete User
// @post DELETE /api/v1/users/:id
// @access Private
exports.deleteUser = handlerFactory.deleteOne(UserModel);

// @des get Logged user data
// @post GET /api/v1/users/getMe
// @access private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
});

// @des Update logged user password
// @post PUT /api/v1/users/changeMyPassword
// @access private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        },
        {
            new: true,
        }
    );
    const token = createToken(user._id);

    res.status(200).json({ data: user, token });
})

// @des Update logged user data
// @post PUT /api/v1/users/updateMe
// @access private/Protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
    const updateUser = await UserModel.findByIdAndUpdate(
        req.user._id,
        {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
        },
        {
            new: true,
        }
    );
    res.status(200).json({ data: updateUser });
});

// @des Delete logged user
// @post DELETE /api/v1/users/deleteMe
// @access private/Protect
exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
    await UserModel.findOneAndUpdate(req.user._id, { active: false });

    res.status(204).json({ status: 'Success' });
});


