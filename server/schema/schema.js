const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLNonNull, GraphQLList } = require('graphql')
const noteModel = require('../../models/noteModel')
const userModel = require('../../models/userModel')
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../../middleware/authorization');
const JWT_SECRET = require('../../config/appconfig').auth.jwt_secret
const UserType = require('../queries/getUser')
const NoteType = require('../queries/getNote')
const AuthType = require('../queries/getAuth');
const getUser = require('../resolvers/getUser');
const getNote = require('../resolvers/getNote');


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: new GraphQLList(UserType),
            args: { id: { type: GraphQLID }, email: { type: GraphQLString } },
            resolve(parent, args) {
                getUser()
            }
        },
        Notes: {
            type: new GraphQLList(NoteType),
            args: { id: { type: GraphQLID } },
            resolve(parent, args, context) {
                const userId = context.user;
                if (userId == null) {
                    throw new Error('User not authenticated')
                }
                return noteModel.find({ userId })
            }
        }
    }
})

const mutation = new GraphQLObjectType({
    name: 'mutation',
    fields: {
        login: {
            type: AuthType,
            args: { email: { type: GraphQLNonNull(GraphQLString) }, password: { type: GraphQLNonNull(GraphQLString) } },
            async resolve(parent, args) {
                const user = await userModel.findOne({ email: args.email })
                if (!user) {
                    throw new Error('User does not exist')
                }
                if (args.password !== user.password) {
                    throw new Error('Password is incorrect')
                }
                const token = jwt.sign({ userId: user._id }, JWT_SECRET)
                console.log("token", token)
                return { token, user }
            }
        },
        loginGoogle: {
            type: AuthType,
            args: { email: { type: GraphQLNonNull(GraphQLString) }, username: { type: GraphQLNonNull(GraphQLString) } },
            async resolve(parent, args) {
                console.log("inside google login", args)
                const user = await userModel.findOne({ email: args.email })
                if (!user) {
                    const newUser = new userModel({
                        username: args.username,
                        email: args.email,
                        password: ""
                    })
                    const savedUser = await newUser.save()
                    const token = jwt.sign({ userId: savedUser._id }, JWT_SECRET)
                    return { user: savedUser, token }
                }
                const token = jwt.sign({ userId: user._id }, JWT_SECRET)
                return { user, token }
            }
        },
        loginFacebook: {
            type: AuthType,
            args: { email: { type: GraphQLNonNull(GraphQLString) }, username: { type: GraphQLNonNull(GraphQLString) } },
            async resolve(parent, args) {
                console.log("inside facebook login", args)
                const user = await userModel.findOne({ email: args.email })
                if (!user) {
                    const newUser = new userModel({
                        username: args.username,
                        email: args.email,
                        password: ""
                    })
                    const savedUser = await newUser.save()
                    const token = jwt.sign({ userId: savedUser._id }, JWT_SECRET)
                    return { user: savedUser, token }
                }
                const token = jwt.sign({ userId: user._id }, JWT_SECRET)
                return { user, token }
            }
        },
        loginGithub: {
            type: AuthType,
            args: { email: { type: GraphQLNonNull(GraphQLString) }, username: { type: GraphQLNonNull(GraphQLString) } },
            async resolve(parent, args) {
                console.log("inside github login", args)
                const user = await userModel.findOne({ email: args.email })
                if (!user) {
                    const newUser = new userModel({
                        username: args.username,
                        email: args.email,
                        password: ""
                    })
                    const savedUser = await newUser.save()
                    const token = jwt.sign({ userId: savedUser._id }, JWT_SECRET)
                    return { user: savedUser, token }
                }
                const token = jwt.sign({ userId: user._id }, JWT_SECRET)
                return { user, token }
            }
        },
        addUser: {
            type: UserType,
            args: {
                username: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                const user = new userModel({
                    username: args.username,
                    email: args.email,
                    password: args.password,
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
            async resolve(parent, args, context) {
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
        updateNote: {
            type: NoteType,
            args: { 'id': { type: GraphQLNonNull(GraphQLID) }, 'title': { type: GraphQLNonNull(GraphQLString) }, 'description': { type: GraphQLNonNull(GraphQLString) } },
            resolve(parent, args, context) {
                if (context.user == null) {
                    throw new Error('User not authenticated')
                }
                return noteModel.findByIdAndUpdate(args.id, { $set: { title: args.title, description: args.description } })
            }
        },
        searchNote: {
            type: new GraphQLList(NoteType),
            args: {
                search: { type: GraphQLString }
            },
            resolve(parent, args, context) {
                const userId = context.user;
                if (userId == null) {
                    throw new Error('User not authenticated')
                }

                const searchRegex = new RegExp(args.search, 'i');
                const query = {
                    userId,
                    $or: [
                        { title: { $regex: searchRegex } },
                        { content: { $regex: searchRegex } }
                    ]
                };

                return noteModel.find(query);
            }
        },
        deleteNote: {
            type: NoteType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args, context) {
                if (context.user == null) {
                    throw new Error('User not authenticated')
                }
                return noteModel.findByIdAndDelete(args.id)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})