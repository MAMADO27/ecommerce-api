const { required } = require('joi');
const mongoose = require('mongoose');

const category_schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: [true, 'Category name must be unique'],
        minlength: [3, 'Category name must be at least 3 characters long'],
        maxlength: [50, 'Category name must be at most 50 characters long'],
    },
    slug: {
        type: String,
        lowercase: true,
    },
    image: {
        type: String,
       required: [true, 'Category image is required'],
    },
    
    
}, { timestamps: true });

// Middleware to set the image URL
// This function sets the image URL for the category document
const set_image_url = (doc) => {
        if (doc.image) {
        const image_url=`${process.env.BASE_URL}/categories/${doc.image}`;
        doc.image = image_url;
    }
}

category_schema.post('init', function(doc) {
    set_image_url(doc);
});
category_schema.post('save', function(doc) {
    set_image_url(doc);
});

const Category = mongoose.model('Category', category_schema);

module.exports = Category;