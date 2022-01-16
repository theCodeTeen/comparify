const mongoose = require('mongoose');
const {isEmail} = require('validator');
const messageSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Sender\'s name is required'],
        trim:true
    },
    email:{
        type:String,
        required:[true,'Email name is required'],
        validate:[isEmail,'invalid Email'],
        unique:[true,'Message from this email is already registered!']
    },
    message:{
        type:String,
        required:[true,'Email name is required']
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Message',messageSchema);