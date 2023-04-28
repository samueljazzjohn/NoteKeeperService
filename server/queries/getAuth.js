const {GraphQLObjectType,GraphQLID,GraphQLString, GraphQLSchema,GraphQLNonNull, GraphQLList} = require('graphql')


const AuthType = new GraphQLObjectType({
    name: 'Auth',
    fields: {
      token: { type: GraphQLString },
    },
});

module.exports = AuthType