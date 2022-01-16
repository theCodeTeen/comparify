const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});

const DB= process.env.DATABASE_URL.replace('<password>',process.env.DATABASE_PASSWORD);
mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true
})
.then(()=>console.log("Database connected"))
.catch(err=>console.log(err));

const app=require('./app.js');


app.listen(process.env.PORT,()=>{
    console.log("listening on port 4001");
});