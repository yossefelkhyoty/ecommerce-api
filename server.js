const path = require('path')

const express = require('express');
const dotenv = require('dotenv');
const morgan = require("morgan");
const cors = require('cors');
const compression = require('compression');


dotenv.config();
const ApiError = require('./utils/apiError');
const globalError = require('./middleware/errorMiddleware')
const dbConnection = require('./config/database');
//Routes
const mountRoutes = require('./routes');

//CONNECT WITH DB
dbConnection();


const app = express();
//Enable other domains access to your applications 
app.use(cors());
//comperss all response
app.use(compression());


//Middlwares
app.set('query parser', 'extended');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
}

//Mount Routes
mountRoutes(app);

app.all('/*splat', (req, res, next) => {
    next(new ApiError(`can't finnd this route: ${req.originalUrl}`, 400));
});


//Global error handeling middleware
app.use(globalError)



//Listening
const { PORT } = process.env;
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


