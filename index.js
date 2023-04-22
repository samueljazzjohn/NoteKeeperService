var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var connectDB = require('./config/dbconnection')
const bodyParser = require('body-parser');
const schema = require('./server/schema/schema')
const { graphqlHTTP } = require('express-graphql')

connectDB

var app = express();

app.use(cors())

app.use('/graphql', graphqlHTTP({
  schema,
  // rootValue: root,
  context: ({ req }) => ({ req }),
  plugins: [
    {
      requestDidStart() {
        return {
          didResolveOperation({ request, document }) {
            const operationName = request.operationName;
            if (operationName === 'Notes'||operationName === 'addNote') {
              getUserId(request.context);
            }
          },
        };
      },
    },
  ],
  graphiql: true,
}));

const port = 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;
