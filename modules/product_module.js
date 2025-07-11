const mongoose = require('mongoose');

const product_schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,

        trim: true,
        minlength: [3,"too short titel"],
        maxlength: [100,"too long titel"],

    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        minlength: [10,"too short description"],
    },
    quantity:{

        type: Number,
        required: true,
        min: [0,"quantity must be greater than 0"],
        max: [10000,"quantity must be less than 10000"]
    },
    sold:{
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        min: [0,"price must be greater than 0"],
        max: [100000,"price must be less than 100000"]
    },
    price_after_discount: {
        type: Number,
        required: true,
        trim: true,
        min: [0,"price after discount must be greater than 0"],
        max: [100000,"price after discount must be less than 100000"]

    },
    colors:[String],
    image:[String],
    image_cover:{
        type: String,
        required: true

    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required:[ true,"must be a valid category"]
    },
    sub_category: {
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory',
        required:[ true,"must be a valid sub category"]
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        min: [0,"rating must be greater than 0"],
        max: [5,"rating must be less than 5"]
    },
    rating_quantity: {
        type: Number,
        default: 0
    },
    ratings_average: {
        type: Number,
        default: 0,
        min: [0,"rating average must be greater than 0"],
        max: [5,"rating average must be less than 5"]
    },
    ratings_quantity: {
        type: Number,
        default: 0
    },

},{timestamps:true,
    //to enable virtuals populate
toJSON:{virtuals:true},
toObject:{virtuals:true}

}
);

product_schema.virtual('reviews',{ref:'Review',
    foreignField:'product',
    localField:'_id'

})


product_schema.pre(/^find/, function(next) {
    this.populate({
        path: 'category',
        select: 'name -_id'
    });
    next();
});



// Middleware to set the image URL
const set_image_url = (doc) => {
    if (doc.image_cover) {
        doc.image_cover = `${process.env.BASE_URL}/products/${doc.image_cover}`;
    }

    
    if (Array.isArray(doc.images)) {
        doc.images = doc.images.map(img =>
            `${process.env.BASE_URL}/products/${img}`
        );
    }
};

product_schema.post('init', function(doc) {
    set_image_url(doc);
});
product_schema.post('save', function(doc) {
    set_image_url(doc);
});

module.exports = mongoose.model('Product', product_schema);