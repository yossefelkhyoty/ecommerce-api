const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const BrandModel = require('../models/brandModel')
const ApiError = require('../utils/apiError');

// @des get barnds
// @post GET /api/v1/brands
// @access Public 
exports.getBrands = asyncHandler(async (req, res) => {

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit

    const brand = await BrandModel.find({}).limit(limit).skip(skip);
    res.status(200).json({ result: brand.length, page, data: brand });
});


// @des get Barnd by id
// @post GET /api/v1/brand/:id
// @access Public 
exports.getBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const brand = await BrandModel.findById(id);
    if (!brand) {
        return next(new ApiError(`No Barnd found for this id :${id} `, 404));
    }
    res.status(200).json({data:brand});
})

// @des create Brands
// @post POST /api/v1/brands
// @access Private 
exports.createBrand=asyncHandler(async(req,res)=>{
    const {name}=req.body
    const brand=await BrandModel.create({
        name,
        slug:slugify(name)
    });
        res.status(201).json({ data: brand });
});



// @des Update Brand
// @post PUT /api/v1/brands/:id
// @access Private

exports.updateBrand = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    const { name } = req.body;
    const brand = await BrandModel.findByIdAndUpdate(
        { _id: id },
        { name, slug: slugify(name) },
        { new: true }
    );
    if (!brand) {
        return next(new ApiError(`No brand found for this id :${id} `, 404))
    };
    res.status(200).json({ data: brand });
});


// @des Delete Brand
// @post DELETE /api/v1/brands/:id
// @access Private

exports.deleteBrand = asyncHandler(async (req, res,next) => {
    const { id } = req.params;
    const brand = await BrandModel.findByIdAndDelete({ _id: id });
    if (!brand) {
        return next(new ApiError(`No Brand found for this id :${id} `, 404))
    };
    res.status(204).send();
})
