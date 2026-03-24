const express = require('express');
const dotenv = require('dotenv');
const morgan = require("morgan");

dotenv.config();
const ApiError = require('./utils/apiError');
const globalError = require('./middleware/errorMiddleware')
const dbConnection = require('./config/database');
//Routes
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const brandRoute = require("./routes/brandRoute");
const productRoute = require("./routes/productRoute");

//CONNECT WITH DB
dbConnection();


const app = express();


//Middlwares

app.use(express.json());

if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
}

//Mount Routes
app.use('/api/v1/categories', categoryRoute)
app.use('/api/v1/subcategories', subCategoryRoute)
app.use('/api/v1/brands', brandRoute)
app.use('/api/v1/products', productRoute)
app.all('/*splat', (req, res, next) => {
    next(new ApiError(`can't finnd this route: ${req.originalUrl}`, 400));
});


//Global error handeling middleware
app.use(globalError)



//Listening
const {PORT} = process.env;
const server = app.listen(PORT, () => {
    console.log(`Server Listening on ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.error(`unhandledRejection Error: ${err.name} || ${err.message}`)
    server.close(() => {
        console.error("Shutting down....")
        process.exit(1);
    })
})