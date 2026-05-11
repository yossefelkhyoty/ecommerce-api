const path = require('path');
const fs = require('fs');

const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require("uuid");
const sharp = require('sharp');

const handlerFactory = require("./handlersFactory");
const{uploadSingleImage}=require('../middleware/uploadImageMiddleware')
const CategoryModel = require('../models/categoryModel');

// ensure upload directory exists
const dir = path.join(__dirname, '../uploads/categories');

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
};

//Upload Single Image
exports.uploadCategoryImage = uploadSingleImage('image');

//Image Prcessing
exports.relizeImage = asyncHandler(async (req, res, next) => {

    if (!req.file) return next();

    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(path.join(dir, filename));
    //Save image into DB
    req.body.image = filename;

    next();

});

// @des get Categories
// @post GET /api/v1/categories
// @access Public 
exports.getCategories = handlerFactory.getAll(CategoryModel);

// @des get Category by id
// @post GET /api/v1/categories/:id
// @access Public 
exports.getCategory = handlerFactory.getOne(CategoryModel);

// @des create Category
// @post POST /api/v1/categories
// @access Private 
exports.createCategories = handlerFactory.createOne(CategoryModel);

// @des Update Category
// @post PUT /api/v1/categories/:id
// @access Private
exports.updateCategory = handlerFactory.updateOne(CategoryModel);

// @des Delete Category
// @post DELETE /api/v1/categories/:id
// @access Private
exports.deleteCategory = handlerFactory.deleteOne(CategoryModel);


