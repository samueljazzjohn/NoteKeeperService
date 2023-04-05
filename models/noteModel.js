const mongoose = require('mongoose')

const NoteSchema = new mongoose.Schema({
    title : {type:String,required:true,unique:true},
    note : {type:String,required:true},
    user: [{ type: Schema.Types.ObjectId, ref: 'UserModel' }]
},{collection:'Notes'}
);  

module.exports = mongoose.model('NoteModel',NoteSchema)