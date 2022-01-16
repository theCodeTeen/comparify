const express=require('express');
const cookieParser = require('cookie-parser');
const cors=require('cors');
const rateLimit = require('express-rate-limit');
const helmet=require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss=require('xss-clean');
const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');
const AppError = require('./utils/AppError');
const ErrorController = require('./controllers/errorController');

const app=express();

//adImages\\2021-05-10T10-53-55.143Ztshrit.jpeg
app.use(cookieParser());
app.use(cors({
origin:true,
credentials:true
}));
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
const limiter=rateLimit({
   max:100,
   windowMs: 1000*60*60,
   message:'Too many request! Try again after an hour'
});
app.use('/api',limiter);
app.use('/adImages',express.static('adImages'));
app.use(express.json());

app.use('/api/user',userRouter);
app.use('/api/admin',adminRouter);

app.use('*',(req,res,next)=>{
   next(new AppError(`${req.originalUrl} is invalid route`,404))
})
app.use(ErrorController);
module.exports=app;