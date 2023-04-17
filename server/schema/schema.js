const {GraphQLObjectType,GraphQLID,GraphQLString, GraphQLSchema,GraphQLNonNull, GraphQLList} = require('graphql')
const noteModel = require('../../models/noteModel')
const userModel = require('../../models/userModel')

// User Type
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

// Note Type
const NoteType = new GraphQLObjectType({
    name:'Note',
    fields:()=>({
        id:{type:GraphQLID},
        title:{type:GraphQLString},
        description:{type:GraphQLString}
    })
})



const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        user:{
            type:new GraphQLList(UserType),
            args:{id:{type:GraphQLID},email:{type:GraphQLString}},
            resolve(parent,args){
                return userModel.find({})
            }
        },
        Notes:{
            type:new GraphQLList(NoteType),
            args:{id:{type:GraphQLID}},
            resolve(parent,args){
                return noteModel.find({userId:args.id})
            }
        }
    }
})

const mutation = new GraphQLObjectType({
    name:'mutation',
    fields:{
        addUser:{
            type:UserType,
            args : {
                username: {type:GraphQLNonNull(GraphQLString)},
                email: {type:GraphQLNonNull(GraphQLString)},
                password: {type:GraphQLNonNull(GraphQLString)},
            },
            resolve(parent,args){
                const user = new userModel({
                    username:args.username,
                    email:args.email,
                    password:args.password,
                })
                return user.save();
            }
        },
        addNote: {
            type: new GraphQLObjectType({
                name: 'AddNoteResult',
                fields: () => ({
                    user: { type: UserType },
                    note: { type: NoteType }
                })
            }),
            args: {
                userId: { type: GraphQLNonNull(GraphQLID) },
                title: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args) {
                const note = new noteModel({
                    title: args.title,
                    description: args.description,
                    userId: args.userId
                })
                const savedNote = await note.save()

                const user = await userModel.findById(args.userId)
                user.notes.push(savedNote._id)
                await user.save()

                return {
                    user,
                    note: savedNote
                }
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query : RootQuery,
    mutation
})