const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
    adType:{
        type:String,
        unique:[true,'This advertisement is already registered!'],
        enum:['advert1','advert2','advert3'],
        required:[true,'adName is required!']
    },
    adUrl:{
        type:String,
        unique:[true,'Duplicate file!'],
        required:[true,'adUrl is required!']
    },
    adAltText:{
        type:String,
        required:[true,'adAltText is required!']
    },
    adAltUrl:{
        type:String
    }
});

module.exports = mongoose.model('Advertisement',advertisementSchema);