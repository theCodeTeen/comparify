const Redirect = require('./../models/Redirect');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

exports.addRedirect =catchAsync(async(req,res,next)=>{
    if(!req.body.redirectTo){
        return next(new AppError('redirectTo is not defined!',400));
    }
    const redirect = await Redirect.create({redirectTo:req.body.redirectTo});

    res.status(200).json({
        status:'success',
        redirect
    });
});

exports.getRedirectCount = catchAsync(async(req,res,next)=>{
    const redirectCount=await Redirect.find().countDocuments();

    res.status(200).json({
        status:'success',
        redirectCount
    });
});