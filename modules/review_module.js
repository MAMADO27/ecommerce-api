const mongoose = require('mongoose');
const review_schema = new mongoose.Schema({
    title: {
        type: String,
    },
    rating: {
        type: Number,
        min:[1,'Rating must be at least 1'],
        max:[5,'Rating must be at most 5'],
        required: [true, 'Rating is required'],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product is required'],
    },

},{timestamps: true});


review_schema.pre(/^find/,function(next){
   this.populate({path:'user',select:'name'/*,'image'*/});
   next();
})
review_schema.statics.calculate_average_ratings = async function (productId) {
    const stats = await this.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: '$product',
                average_rating: { $avg: '$rating' },
                number_of_reviews: { $sum: 1 }
            }
        }
    ]);
    if (stats.length > 0) {
        await this.model('Product').findByIdAndUpdate(productId, {
            ratings_average: stats[0].average_rating,
            ratings_quantity: stats[0].number_of_reviews
        });
    } else {
        await this.model('Product').findByIdAndUpdate(productId, {
            ratings_average: 0,
            ratings_quantity: 0
        });
    }
};
review_schema.post('save',async function () {
    await this.constructor.calculate_average_ratings(this.product);
});

review_schema.post('remove',async function () {
    await this.constructor.calculate_average_ratings(this.product);
});


module.exports = mongoose.model('Review', review_schema);