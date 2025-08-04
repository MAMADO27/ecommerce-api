const mongoose = require('mongoose');
const copon_schema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Copon code is required'],
        trim: true,
        unique: [true, 'Copon code must be unique'],
        
    },
    expire:{
        type: Date,
        required: [true, 'Copon expiration date is required'],
    },
    discount: {
        type: Number,
        required: [true, 'Copon discount is required'],
    },
}, { timestamps: true });


module.exports = mongoose.model('Copon',copon_schema);