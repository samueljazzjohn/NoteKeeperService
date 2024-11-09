const {GraphQLObjectType,GraphQLID,GraphQLString, GraphQLSchema,GraphQLNonNull, GraphQLList} = require('graphql')


const NoteType = new GraphQLObjectType({
    name:'Note',
    fields:()=>({
        id:{type:GraphQLID},
        title:{type:GraphQLString},
        description:{type:GraphQLString}
    })
})

module.exports = NoteType