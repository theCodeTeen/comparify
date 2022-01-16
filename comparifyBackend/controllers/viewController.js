const View = require('./../models/View');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

exports.addView = catchAsync(async(req,res,next)=>{
        if(!req.body.pageName)
        {
            return next(new AppError('pageName must be defined!',400));
        }
        const view= await View.create({pageName:req.body.pageName});

        res.status(200).json({
            status:'success',
            view
        })
});

exports.getViewCount = catchAsync(async(req,res,next)=>{
    const viewCount=await View.find().countDocuments();

    res.status(200).json({
        status:'success',
        viewCount
    });
});