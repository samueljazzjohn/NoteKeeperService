var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors=require('cors')
var connectDB=require('./config/dbconnection')
const bodyParser = require('body-parser');
const schema = require('./server/schema/schema')
const {graphqlHTTP} = require('express-graphql')

connectDB

var app = express();

app.use('/graphql', graphqlHTTP({
    schema,
    // rootValue: root,
    graphiql: true,
}));

const port = 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;
