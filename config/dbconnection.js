var mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGODB_URI

mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true }).then((result)=>{
    console.log("Database connected successdully")
}).catch((err)=>{
    console.log("connection error")
})