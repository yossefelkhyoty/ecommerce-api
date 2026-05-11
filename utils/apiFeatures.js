/* eslint-disable node/no-unsupported-features/es-syntax */
class ApiFeatures {
    constructor(mongooseQuery, queryStringObj) {
        this.mongooseQuery = mongooseQuery;
        this.queryStringObj = queryStringObj;
        this.filterConditions = {};
    }

    //1)filter
    filter() {
        const queryStringObj = { ...this.queryStringObj };
        const excluadesFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
        excluadesFields.forEach((field) => delete queryStringObj[field]);

        //Apply filteration using [gte,gt,lte,lt]
        let queryStr = JSON.stringify(queryStringObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        this.filterConditions = JSON.parse(queryStr);
        return this;
    }

    //2)Pagination
    paginate(countDocuments) {
        const page = this.queryStringObj.page * 1 || 1;
        const limit = this.queryStringObj.limit * 1 || 50;
        const skip = (page - 1) * limit;
        const endIndex = page * limit;

        //Pagination result
        const pagination = {};
        pagination.currentPage = page;
        pagination.limit = limit;
        pagination.numberOfPage = Math.ceil(countDocuments / limit);

        //Next page
        if (endIndex < countDocuments) {
            pagination.next = page + 1;
        }
        //Prev page
        if (skip > 0) {
            pagination.perv = page - 1;
        }

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

        this.paginationResult = pagination;
        return this;
    }

    //3)Search
    search(modelName) {
        const { keyword } = this.queryStringObj;
        if (keyword) {
            if (modelName === "products") {
                this.filterConditions.$or = [
                    { title: { $regex: keyword, $options: 'i' } },
                    { description: { $regex: keyword, $options: 'i' } },
                ];
            } else {
                this.filterConditions.name = {
                    $regex: keyword,
                    $options: 'i'
                };
            }
        };
        return this;
    }

    //4)Sort
    sort() {
        if (this.queryStringObj.sort) {
            const sortBy = this.queryStringObj.sort.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else {
            this.mongooseQuery = this.mongooseQuery.sort("-createdAt")
        }
        return this;
    }

    //5) limitFields
    limitFields() {
        if (this.queryStringObj.fields) {
            const fields = this.queryStringObj.fields.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields);
        } else {
            this.mongooseQuery = this.mongooseQuery.select('-__v');
        }
        return this;
    }

    applyFilter() {
    this.mongooseQuery = this.mongooseQuery.find(this.filterConditions);
    return this;
}

}

module.exports = ApiFeatures;