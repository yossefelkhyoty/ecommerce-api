const path = require('path');
const fs = require('fs');

const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require("uuid");
const sharp = require('sharp');

const { uploadMixOfImages } = require('../middleware/uploadImageMiddleware')
const handlerFactory = require("./handlersFactory");
const ProductModel = require('../models/productModel');

// ensure upload directory exists
const dir = path.join(__dirname, '../uploads/products');

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}


exports.uploadProductImages = uploadMixOfImages([{
    name: 'imageCover',
    maxCount: 1,
},
{
    name: 'images',
    maxCount: 5,
},
]);

exports.relizeProductImages = asyncHandler(async (req, res, next) => {
    //1-image Processing for imageCover
    if (req.files.imageCover) {
        const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
        await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(path.join(dir, imageCoverFileName));
        //Save image into DB
        req.body.imageCover = imageCoverFileName;

    }
    //2-image Processing for images

    if (req.files.images) {
        req.body.images = [];
        await Promise.all(req.files.images.map(async (img, index) => {
            const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

            await sharp(img.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 95 })
                .toFile(path.join(dir, imageName));
            //Save image into DB
            req.body.images.push(imageName);
        }))

    }
    next()
});

// @des get Products
// @post GET /api/v1/Products
// @access Public 
exports.getProducts = handlerFactory.getAll(ProductModel, "products");

// @des get Product by id
// @post GET /api/v1/Products/:id
// @access Public 
exports.getProduct = handlerFactory.getOne(ProductModel,'reviews');

// @des create Product
// @post POST /api/v1/Products
// @access Private 
exports.createProducts = handlerFactory.createOne(ProductModel);

// @des Update Product
// @post PUT /api/v1/Products/:id
// @access Private
exports.updateProduct = handlerFactory.updateOne(ProductModel);

// @des Delete product
// @post DELETE /api/v1/Products/:id
// @access Private
exports.deleteProduct = handlerFactory.deleteOne(ProductModel);

