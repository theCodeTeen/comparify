const mongoose = require('mongoose');

const viewSchema = new mongoose.Schema({
    pageName:{
        type:String,
        required:[true,'A page name is required!'],
        enum:['home','contact','login','results']
    },
    viewedAt:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model('View',viewSchema);