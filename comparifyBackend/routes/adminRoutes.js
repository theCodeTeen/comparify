const express=require('express');
const multer=require('multer');
const slugify=require('slugify');
const authController = require('./../controllers/authController');
const adminController = require('./../controllers/adminController');
const viewController=require('./../controllers/viewController');
const redirectController=require('./../controllers/redirectController');
const searchController=require('./../controllers/searchController');


const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./adImages/');
    },
    filename:function(req,file,cb){
        cb(null,new Date().toISOString().replace(/:/g,'-')+slugify(file.originalname,'-'));
    }
});

const fileFilter = (req,file,cb)=>{
    if(file.mimetype==="image/jpeg"||file.mimetype==="image/jpg"||file.mimetype==="image/png")
    {
        return cb(null,true);
    }
    cb(null,false);
}
const upload=multer({
    storage,
    limits:{
    fileSize:1024*1024*16
    },
    fileFilter
});

const router= express.Router();


router.route('/login')
.post(authController.login);

router.route('/logout')
.get(authController.protect,authController.logout);

// router.route('/signin')
// .post(authController.createAdmin);

router.route('/search')
.get(authController.protect,searchController.getSearchCount);

router.route('/view')
.get(authController.protect,viewController.getViewCount);

router.route('/redirect')
.get(authController.protect,redirectController.getRedirectCount);

router.route('/message')
.get(authController.protect,adminController.getMessages)
.delete(authController.protect,adminController.deleteMessage);

router.route('/advertisement')
.get(adminController.getAdvertisements)
.post(authController.protect,upload.single('advertImage'),adminController.setAdvertisement)
.patch(authController.protect,adminController.updateAdAltUrl)
.delete(authController.protect,adminController.deleteAdvertisement);
module.exports = router;
