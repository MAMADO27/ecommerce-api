const category_route = require('./category_route');
const sub_category_route = require('./sub_category_route');
const brands_route = require('./brands_route');
const product_route = require('./product_route'); 
const user_route = require('./user_route');
const auth_route = require('./auth_route');
const review_route = require('./review_route');
const wishlist_route = require('./wishlist_route');
const adress_route = require('./adress_route');
const copon_route = require('./copon_route');
const cart_route = require('./cart_route');
const order_route = require('./order_route');
const invoice_route = require('./invoice_route');
// Function to mount all routes
 const mount_routes = (app) => {
    app.use('/api/v1/categories', category_route);
    app.use('/api/v1/subcategories', sub_category_route);
    app.use('/api/v1/brands', brands_route);
    app.use('/api/v1/products', product_route);
    app.use('/api/v1/users', user_route);
    app.use('/api/v1/auth', auth_route);
    app.use('/api/v1/reviews', review_route);
    app.use('/api/v1/wishlist', wishlist_route);
    app.use('/api/v1/adresses', adress_route);
    app.use('/api/v1/copons', copon_route);
    app.use('/api/v1/carts', cart_route);
    app.use('/api/v1/orders', order_route);
    app.use('/api/v1/invoices', invoice_route);
}


module.exports = mount_routes;
