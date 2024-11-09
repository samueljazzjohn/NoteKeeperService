const {GraphQLObjectType,GraphQLID,GraphQLString, GraphQLSchema,GraphQLNonNull, GraphQLList} = require('graphql')
const getUser=require('./getUser')

const AuthType = new GraphQLObjectType({
    name: 'Auth',
    fields: {
      token: { type: GraphQLString },
      user: { type: getUser },
    },
});

module.exports = AuthType