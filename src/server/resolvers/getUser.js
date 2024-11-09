const userModel = require('../../models/userModel');

async function getUser(){
    return userModel.find({})
}

module.exports = getUser