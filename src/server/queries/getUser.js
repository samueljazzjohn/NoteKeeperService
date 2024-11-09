const {GraphQLObjectType,GraphQLID,GraphQLString, GraphQLSchema,GraphQLNonNull, GraphQLList} = require('graphql')

const NoteType = require('./getNote')

const UserType = new GraphQLObjectType({
    name:'User',
    fields : ()=>({
        id:{type:GraphQLID},
        username:{type:GraphQLString},
        email:{type:GraphQLString},
        password:{type:GraphQLString},
        notes:{
            type:GraphQLList(NoteType),
            resolve(parent,args){
                return noteModel.find((notes)=>notes.id===parent.id)
            }

        }
    })
})

module.exports = UserType