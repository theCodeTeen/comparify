const mongoose = require('mongoose');
const Search = new mongoose.Schema({
    productKey:{
        type:String,
        required:true,
        trim:true
    },
    noOfResults:{
        type:Number,
        default:0
    },
    searchTime:{
        type:Date,
        default:Date.now()
    },
    sortedBy:{
        type:String,
        default:'price'
    }
});
module.exports=mongoose.model('Search',Search);