const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username:{type:String,required:true},
    email : {type:String,required:true,unique:true,index:true},
    password : {type:String,required:true},
    notes: [{ type: mongoose.Types.ObjectId, ref: 'NoteModel' }]
},{collection:'Users'}
);

module.exports = mongoose.model('UserModel',UserSchema)