const mongoose = require('mongoose');


const brands_schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Brands name is required'],
        unique: [true, 'Brands name must be unique'],
        minlength: [3, 'Brands name must be at least 3 characters long'],
        maxlength: [50, 'Brands name must be at most 50 characters long'],
    },
    slug: {
        type: String,
        lowercase: true,
    },
    image :String,
    
}, { timestamps: true });
// Middleware to set the image URL
// This function sets the image URL for the brands document
const set_image_url = (doc) => {
        if (doc.image) {
        const image_url=`${process.env.BASE_URL}/categories/${doc.image}`;
        doc.image = image_url;
    }
}

brands_schema.post('init', function(doc) {
    set_image_url(doc);
});
brands_schema.post('save', function(doc) {
    set_image_url(doc);
});


module.exports = mongoose.model('brand', brands_schema);

