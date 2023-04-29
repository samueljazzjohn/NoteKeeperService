require('dotenv').config();

// config.js
module.exports = {
	app: {
		port: process.env.PORT || 5000,
	},
	auth: {
		jwt_secret: process.env.JWT_SECRET,
	},
    db:{
        uri : process.env.MONGODB_URI,
    },
    email:{
        username : process.env.EMAIL_USERNAME,
        password : process.env.EMAIL_PASSWORD,
    },
    client:{
        url : process.env.CLIENT_URL,
    }

};