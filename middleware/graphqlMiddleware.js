const JWT_SECRET = require('../config/appconfig').auth.jwt_secret
const { graphqlHTTP } = require('express-graphql');
const schema = require('../server/schema/schema')
const jwt = require('jsonwebtoken');

const graphqlMiddleware = graphqlHTTP(async (request, response, graphQLParams) => {
    const context = {
      user: null
    };
    if (request.headers.authorization) {
    const token = request.headers.authorization.split(' ')[1];
      try {
        const decodedToken = await jwt.verify(token, JWT_SECRET);
        context.user = decodedToken.userId;
      } catch (error) {
        console.error('JWT verification error: ', error.message);
      }
    }
    return {
      schema,
      graphiql: true,
      context,
    };
  });

module.exports={"graphqlMiddleware": graphqlMiddleware  }