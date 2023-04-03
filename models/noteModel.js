const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email : {type:String,required:true,unique:true},
    password : {type:String,required:true},
    type : {type:String,required:true,enum:['customer','company']}
},{collection:'Users'}
);

module.exports = mongoose.model('UserModel',UserSchema)