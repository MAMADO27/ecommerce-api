const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' });
const api_error = require('./utils/api_error');
const global_error = require('./middelware/error_middelware');
const morgan = require('morgan');
const database = require('./config/databais');
const rate_limit = require('express-rate-limit');
const hpp = require('hpp');
const mongo_sanitize = require('express-mongo-sanitize');
const mount_routes = require('./routes/index');
const cors = require('cors');
const compression = require('compression');

database();

const app = express();
app.use(cors());
app.options('/*any', cors());
app.use(compression());
app.use(express.json({limit: '50mb'}));
app.use(express.static(path.join(__dirname, 'uploads')));


if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`Mode is ${process.env.NODE_ENV}`);
}
//app.use(mongo_sanitize());

const limiter = rate_limit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

app.use(hpp({
    whitelist: [
        'price',
        'ratingsAverage',
        'ratingsQuantity',
        'quantity',
        'discount',
        'discountPrice'
    ]
}));

// Mount all routes
mount_routes(app);

app.all('/*any', (req, res, next) => {
    next(new api_error(`The URL ${req.originalUrl} you requested was not found on this server.`, 400))
});

app.use(global_error);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});





// Handle uncaught exceptions
process.on('unhandled_rejection', (err) => {
    console.error(`unhandled_rejection Erorrs: ${err.name} | ${err.message}`);
   server.close(() => {
    console.error('Shutting down the server due to unhandled rejection');
    process.exit(1);
});
});