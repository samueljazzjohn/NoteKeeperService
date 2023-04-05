const {GraphQLObjectType,GraphQLID,GraphQLString, GraphQLSchema} = require('graphql')

const userType = new GraphQLObjectType({
    name:'User',
    fields : ()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        email:{type:GraphQLString},
        password:{type:GraphQLString}
    })
})



const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        userType:{
            type:userType,
            args:{id:{type:GraphQLID},email:{type:GraphQLString}},
            resolve(parent,args){}
        }
    }
})


module.exports = new GraphQLSchema({
    query : RootQuery
})