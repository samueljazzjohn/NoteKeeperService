const {GraphQLObjectType,GraphQLID,GraphQLString, GraphQLSchema,GraphQLNonNull, GraphQLList} = require('graphql')
const noteModel = require('../../models/noteModel')
const userModel = require('../../models/userModel')
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../../middleware/authorization');
const JWT_SECRET  = require('../../config/appconfig').auth.jwt_secret

// Auth Type
const AuthType = new GraphQLObjectType({
    name: 'Auth',
    fields: {
      token: { type: GraphQLString },
    },
});


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
            resolve(parent,args,context){
                const userId = context.user;
                if(userId==null){
                    throw new Error('User not authenticated')
                }
                return noteModel.find({userId}) 
            }
        }
    }
})

const mutation = new GraphQLObjectType({
    name:'mutation',
    fields:{
        login:{
            type:AuthType,
            args:{email:{type:GraphQLNonNull(GraphQLString)},password:{type:GraphQLNonNull(GraphQLString)}},
            async resolve(parent,args){
                const user =await userModel.findOne({email:args.email})
                if(!user){
                    throw new Error('User does not exist')
                }
                if(args.password !== user.password){
                    throw new Error('Password is incorrect')
                }
                const token = jwt.sign({userId:user._id},JWT_SECRET)
                return {token}
            }
        },
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
                // userId: { type: GraphQLNonNull(GraphQLID) },
                title: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args,context) {
                console.log("inside addNote",context.user)
                const userId = context.user
                const note = new noteModel({
                    title: args.title,
                    description: args.description,
                    userId: userId
                })
                const savedNote = await note.save()

                const user = await userModel.findById(userId)
                user.notes.push(savedNote._id)
                await user.save()

                return {
                    user,
                    note: savedNote
                }
            }
        },
        updateNote:{
            type:NoteType,
            args:{ 'id':{type:GraphQLNonNull(GraphQLID)},'title':{type:GraphQLNonNull(GraphQLString)},'description':{type:GraphQLNonNull(GraphQLString)}},
            resolve(parent,args,context){
                if(context.user==null){
                    throw new Error('User not authenticated')
                }
                return noteModel.findByIdAndUpdate(args.id,{$set:{title:args.title,description:args.description}})
            }
        },
        deleteNote:{
            type:NoteType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args,context){
                if(context.user==null){
                    throw new Error('User not authenticated')
                }
                return noteModel.findByIdAndDelete(args.id)
            }
        }   
    }
})

module.exports = new GraphQLSchema({
    query : RootQuery,
    mutation
})