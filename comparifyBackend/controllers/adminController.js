const slugify=require('slugify');
const Message = require('./../models/Message');
const Advertisement = require('./../models/Advertisement');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
const {promisify} = require('util');
const fs=require('fs');



exports.getMessages= catchAsync(async(req,res,next)=>{
    const messages = await Message.find().sort('-createdAt').select('-__v');

    res.status(200).json({
        status:'success',
        length:messages.length,
        data:messages
    })
});

exports.deleteMessage = catchAsync(async(req,res,next)=>{
    if(!req.query.msgId)
    {
        return next(new AppError(`msgId not defined!`,400));
    }

    await Message.findOneAndDelete({_id:req.query.msgId});

    res.status(204).json({
        status:'success',
        data:null
    })
});
const deleteAd = async(req,next)=>{
    if(!req.body.adType)
    {
        return next('adType is not defined!',400);
    }
    //retrieve and check if there is an same adType
   const advert= await Advertisement.findOne({adType:req.body.adType});
   console.log(advert);
   if(advert){
       // delete from file system
       let fileName=advert.adUrl.split('\\');
       fileName=fileName[fileName.length-1];
       console.log(fileName);
       await promisify(fs.unlink)(`./adImages/${fileName}`)
       .catch(err=>next(new AppError('Unable to delete existing advertisement!',500)));

        //delete from database
        await Advertisement.deleteOne({adType:req.body.adType}).catch(err=>next(new AppError('Unable to delete existing advertisement from DB',500)));

   }
}
exports.deleteAdvertisement = catchAsync(async(req,res,next)=>{
    req.body.adType=req.query.adType;
    await deleteAd(req,next);
    res.status(204).json({
        status:'success',
        data:null
    });
});

exports.setAdvertisement = catchAsync(async(req,res,next)=>{
   const adAltText=req.file.originalname;
   console.log(req.file);
   console.log(req.body.adAltUrl);
   console.log(req.body.adType);
   if(!req.file||!req.body.adType)
   {
       next(new AppError('File OR adType property is required!',400));
   }

   await deleteAd(req,next);

   const newAdvert = await Advertisement.create({
       adType:req.body.adType,
       adUrl:req.file.path,
       adAltText:adAltText,
       adAltUrl:req.body.adAltUrl
    });

   res.status(200).json({
       status:'success',
       newAdvert
   })
});
exports.getAdvertisements = catchAsync(async(req,res,next)=>{
    const adverts = await Advertisement.find();
    // adverts.forEach(el=>{
    //     el.adUrl=__dirname.replace('controllers',el.adUrl);
    // });
    res.status(200).json({
        status:'success',
        data:adverts
    });
});
exports.updateAdAltUrl = catchAsync(async(req,res,next)=>{
    if(!req.body.adAltUrl||!req.body.adType){
        return next('adAltUrl or adType not defined!',400);
    }
    const updatedAdvert = await Advertisement.findOneAndUpdate({adType:req.body.adType},{adAltUrl:req.body.adAltUrl});
    if(!updatedAdvert)
    {
        return next('unable to update the advertisement, check if adType is valid!',500);
    }
    res.status(200).json({
        status:'success',
        adAltUrl:req.body.adAltUrl
    })
})