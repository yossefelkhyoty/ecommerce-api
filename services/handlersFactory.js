const asyncHandler = require('express-async-handler')
const ApiError = require('../utils/apiError');
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;

        const document = await Model.findOneAndDelete({ _id: id });

        if (document) {
            if (Model.modelName === 'Review') {
                const productId = document.product;

                // Recalculate average ratings and quantity for the product
                await Model.calcAvgRatingsAndQuantity(productId);
            }

            res.status(200).json({ item: `${document._id} : successfully deleted` });
        } else {
            return next(new ApiError(`No Document for this id ${id}`, 404));
        }
    });

exports.updateOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const document = await Model.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!document) {
            return next(new ApiError(`No document found for this id :${id} `, 404))
        };

        //Trigger "update" event when update document
        document.save();

        res.status(200).json({ data: document });
    });

exports.createOne = (Model) =>
    asyncHandler(async (req, res) => {
        const document = await Model.create(req.body);
        res.status(201).json({ data: document });
    });

exports.getOne = (Model, populationOpt) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        let query = Model.findById(id);
        if (populationOpt) {
            query = query.populate(populationOpt);
        }
        const document = await query;
        if (!document) {
            return next(new ApiError(`No document found for this id :${id} `, 404));
        }
        res.status(200).json({ data: document });
    })


exports.getAll = (Model, modelName = '') =>
    asyncHandler(async (req, res) => {
        let filter = {};
        if (req.filterObj) {
            filter = req.filterObj;
        }

        //Bulid query
        const documentCounts = await Model.countDocuments();
        const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
            .paginate(documentCounts)
            .filter()
            .search(modelName)
            .applyFilter()
            .sort()
            .limitFields()


        //Execute query
        const { mongooseQuery, paginationResult } = apiFeatures
        const document = await mongooseQuery;

        res.status(200).json({ result: document.length, paginationResult, data: document });
    });