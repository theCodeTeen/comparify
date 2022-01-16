const mongoose = require('mongoose');

const redirectSchema = new mongoose.Schema({
    redirectTo:{
        type:String,
        required:[true,'A website url is required!']
    },
    redirectedAt:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model('Redirect',redirectSchema);