const noteModel = require('../../models/noteModel');

async function getNote(context) {
    console.log(context)
    const userId = context.user;
    if (userId == null) {
        throw new Error('User not authenticated')
    }
    const notes=await noteModel.find({ userId })
    return notes
}

module.exports = getNote