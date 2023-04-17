const mongoose = require('mongoose')

const NoteSchema = new mongoose.Schema({
    title : {type:String,required:true,unique:true},
    userId: { type: mongoose.Types.ObjectId, ref: 'UserModel' },
    description : {type:String,required:true},
},{collection:'Notes'}
);  

module.exports = mongoose.model('NoteModel',NoteSchema)