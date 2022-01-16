const AppError = require("../utils/AppError");

const handleCastErrorDB = err =>{
    return new AppError(`Invalid ${err.path} : ${err.value}`,400);
}

const handleDuplicateField = err =>{
    let field= err.keyValue[Object.keys(err.keyValue)[0]];
    return new AppError(`Duplicate field value "${field}". Please use another value`,400);
}

const handleValidationErrorDB = err =>{
    let msg= Object.values(err.errors).map(el=>el.message).join(". ");
    return new AppError(`VALIDATION_ERROR: ${msg}`,400);
    //console.log(msgs);
    //console.log(err.errors);
}

const handleInvalidTokenError = ()=>{
    return new AppError(`Token is invalid! Login again....`,401);
}
const handleExpiredTokenError = ()=>{
    return new AppError(`Token is expired! Login again....`,401);
}


module.exports = (err,req,res,next)=>{
    console.log(err,err.message);
    let Error = {message:err.message,...err};
    console.log(Error);
    const statusCode = err.statusCode || 500;
    const status = err.status || 'Error';
    if(err.name=="CastError") Error = handleCastErrorDB(Error);
    else if(err.code==11000) Error = handleDuplicateField(Error);
    else if(err.name=="ValidationError") Error = handleValidationErrorDB(Error);
    else if(err.name=="JsonWebTokenError") Error = handleInvalidTokenError();
    else if(err.name=="TokenExpiredError") Error = handleExpiredTokenError();
    if(Error.isOperational)
    {
        console.log(Error.message);
        res.status(statusCode).json({
            status,
            message:Error.message
        });
    }
    else
    {
        console.error("ERROR:",err);
        res.status(500).json({
            status:'Error',
            message:'Something went wrong!'
        });
    }
}