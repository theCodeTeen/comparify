const mongoose=require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Username should be specified']
    },
    password:{
        type:String,
        required:[true,'Password should be specified'],
        minLength:[5,'Password must be least 5 characters long'],
        select:false
    },
    passwordCheck:{
        type:String,
        required:[true,'PasswordCheck should be specified'],
        minLength:[5,'Password must be least 5 characters long'],
        validate:{
            validator:function(el){
                return el===this.password;
            },
            message:"Password doesn't match"
        }
    },
    role:{
        type:String,
        default:'admin',
        enum:['admin']
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

userSchema.pre('save',async function(next){
    if(this.isModified('password'))
    {
        this.password= await bcrypt.hash(this.password,12);
        this.passwordCheck=undefined;
    }
    next();
})
userSchema.methods.checkPassword = async function(candidate,authentic){
    return await bcrypt.compare(candidate,authentic);
}


module.exports = mongoose.model('Admin',userSchema);