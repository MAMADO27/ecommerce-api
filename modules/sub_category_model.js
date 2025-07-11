const mongoose = require('mongoose');
const sub_category = require('../modules/sub_category_model');
const sub_category_schema = new mongoose.Schema({
 name:{
    type:String,
    trim:true,
    unique:[true,"sub category name must be unique"],
    minLength:[2,"sub category name must be at least 2 characters"],
    maxLength:[32,"sub category name must be at most 32 characters"],
 },
    slug:{
        type:String,
        lowercase:true,
        //sparse:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:[true,"Please provide a category"],
    },

},{timestamps:true});


module.exports = mongoose.model("SubCategory",sub_category_schema);