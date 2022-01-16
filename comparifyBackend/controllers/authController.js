const User=require('./../models/User');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
const jwt=require('jsonwebtoken');
const {promisify}=require('util');

exports.login=catchAsync(async(req,res,next)=>{

    const username = req.body.username;
    const password=req.body.password;
    const passwordCheck = req.body.passwordCheck;

    if(!username||!password){
        return next(new AppError('Username and password required to login!',400));
    }

    const user = await User.findOne({username}).select('+password');

    if(!user||!await user.checkPassword(password,user.password))
    {
        return next(new AppError('Username or password is incorrect',400));
    }

    const token = jwt.sign({id:user._id},process.env.TOKEN_SECRET,{
            expiresIn:process.env.TOKEN_EXPIRES_IN
    });

    // res.cookie('jwt',token,{
    //     expires:new Date(Date.now()+process.env.COOKIE_EXPIRES_IN*24*60*60*1000),
    //     secure:true,
    //     httpOnly:true,
	// sameSite:'None'
    // });
    
    res.status(200).json({
        status:'success',
        message:'logged in succesfully!',
        jwt:token
    })
});

exports.logout = catchAsync(async(req,res,next)=>{
    res.status(200).json({
        status:'success',
        message:'Logout successful!'
    })
})

exports.protect = catchAsync(async(req,res,next)=>{
   let token;
   console.log(!(req.headers['authorization'].split(' ')[0]=="Bearer"));
//    !req.headers['authorization']||
   if(!req.headers['authorization']||!(req.headers['authorization'].split(' ')[0]=="Bearer"))
   {
    //    console.log("jejej");
       return next(new AppError('Not logged in!',401));
   }

   token = req.headers['authorization'].split(' ')[1];

   let decoded= await promisify(jwt.verify)(token,process.env.TOKEN_SECRET);
    console.log(decoded);

//    console.log(decoded.exp,Date.now());
   if(!decoded.id||decoded.exp*1000<Date.now())
   {
       return next(new AppError('Token is either invalid or expired! Login again...',401));
   }

   const user=await User.findById(decoded.id);

   if(!user)
   {
        return next(new AppError('Token is either invalid or expired! Login again...',401));
   }

   req.user = user;
   next();
});



exports.createAdmin = catchAsync(async(req,res,next)=>{
   const username= req.body.username;
   const password= req.body.password;
   const passwordCheck = req.body.passwordCheck;

   const admin = await User.create({username,password,passwordCheck});

   res.status(200).json({
       status:'sucess',
       admin
   })
});