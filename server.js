const path = require('path')

const express = require('express');
const dotenv = require('dotenv');
const morgan = require("morgan");
const cors = require('cors');
const compression = require('compression');
const hpp = require('hpp-clean');
const mongoSanitize = require('@exortek/express-mongo-sanitize');
const { xss } = require('express-xss-sanitizer');

dotenv.config();
const ApiError = require('./utils/apiError');
const globalError = require('./middleware/errorMiddleware')
const dbConnection = require('./config/database');
const { apiLimiter } = require('./middleware/rateLimit.middleware');
//Routes
const mountRoutes = require('./routes');
const { webhookCheckout } = require('./services/orderService');



//CONNECT WITH DB
dbConnection();


const app = express();
//Enable other domains access to your applications 
app.use(cors());
//comperss all response
app.use(compression());

// Checkout webhook
app.post('/api/v1/webhook-checkout', express.raw({ type: 'application/json' }), webhookCheckout);


//Middlwares
app.set('query parser', 'extended');
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
}

// To remove data using these defaults:
app.use(mongoSanitize());
app.use(xss());

// Apply the rate limiting middleware to all requests.
app.use('/api', apiLimiter);

//Middleware to protect against HTTP Parameter pollution attacks   
app.use(
    hpp({
        whitelist: [
            'price',
            'sold',
            'quantity',
            'ratingsAverage',
            'ratingsQuantity',
        ],
    })
);


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


