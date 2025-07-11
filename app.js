const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' });
const api_error = require('./utils/api_error');
const global_error = require('./middelware/error_middelware');
const morgan = require('morgan');
const database = require('./config/databais');
const category_route = require('./routes/category_route');
const sub_category_route = require('./routes/sub_category_route');
const brands_route = require('./routes/brands_route');
const product_route = require('./routes/product_route'); 
const user_route = require('./routes/user_route');
const auth_route = require('./routes/auth_route');
const rate_limit = require('express-rate-limit');
const hpp = require('hpp');
const mongo_sanitize = require('express-mongo-sanitize');
const review_route = require('./routes/review_route');
const wishlist_route = require('./routes/wishlist_route');
const adress_route = require('./routes/adress_route');

database();

const app = express();
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

app.use('/api/v1/categories', category_route);
app.use('/api/v1/Subcategories', sub_category_route);
app.use('/api/v1/brands', brands_route);
app.use('/api/v1/products', product_route);
app.use('/api/v1/users', user_route);
app.use('/api/v1/auth', auth_route);
app.use('/api/v1/reviews', review_route);
app.use('/api/v1/wishlist', wishlist_route);
app.use('/api/v1/adresses', adress_route);

app.all('/*splat', (req, res, next) => {
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
    server.close(() => () => {
        console.error('Shutting down the server due to unhandled rejection');
        process.exit(1);
    });
});