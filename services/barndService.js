const path = require('path');
const fs = require('fs');

const { v4: uuidv4 } = require("uuid");
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');


const handlerFactory = require("./handlersFactory")
const{uploadSingleImage}=require('../middleware/uploadImageMiddleware')
const BrandModel = require('../models/brandModel')


// ensure upload directory exists
const dir = path.join(__dirname, '../uploads/brands');

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

//Upload Single Image
exports.uploadBrandImage = uploadSingleImage('image');

//Image Prcessing
exports.relizeImage = asyncHandler(async (req, res, next) => {

    if (!req.file) return next();

    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(path.join(dir, filename));
    //Save image into DB
    req.body.image = filename;

    next();

});

// @des get barnds
// @post GET /api/v1/brands
// @access Public 
exports.getBrands = handlerFactory.getAll(BrandModel);

// @des get Barnd by id
// @post GET /api/v1/brand/:id
// @access Public 
exports.getBrand = handlerFactory.getOne(BrandModel);

// @des create Brands
// @post POST /api/v1/brands
// @access Private 
exports.createBrand = handlerFactory.createOne(BrandModel);

// @des Update Brand
// @post PUT /api/v1/brands/:id
// @access Private
exports.updateBrand = handlerFactory.updateOne(BrandModel);

// @des Delete Brand
// @post DELETE /api/v1/brands/:id
// @access Private
exports.deleteBrand = handlerFactory.deleteOne(BrandModel);
