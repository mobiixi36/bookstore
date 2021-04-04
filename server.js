const express = require('express');
const { graphqlHTTP } = require("express-graphql");
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull } = require('graphql');
const app = express();

const authors = [
    { id: 1, name: 'Soja G' },
    {id: 2, name: 'Suni H'},
]
const books = [
    { id: 1, name: 'Suomen mesteri 1', authorId: 1 },
    { id: 2, name: 'Suomen mesteri 2', authorId: 1 },
    { id: 3, name: 'Suomen mesteri 3', authorId: 2 }
]

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents a author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) => {
            return books.filter(book => book.authorId === author.id)
        }}
    })
})

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This represents a book',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authoirId: { type: GraphQLNonNull(GraphQLInt) },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
})
const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        books: {
            type: new GraphQLList(BookType),
            description: 'List of books',
            resolve: () => books
        },
        book: {
            type: BookType,
            description: 'Single book',
            args: {id: {type: GraphQLInt}},
            resolve: (parent, args) => books.find(book => book.id === args.id)
        },
        
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of authors',
            resolve: () => authors
        },

        author: {
            type: AuthorType,
            description: 'Single author',
            args: { id: { type: GraphQLInt } },
            resolve: (parent, args) => authors.find(author => author.id === args.id)
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root mutation',
    fields: () => ({
        addBook: {
            type: BookType, // return a book
            description: 'add a book',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                authorId: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                const book = {
                    id: books.length + 1,
                    name: args.name,
                    authoirId: args.authoirId
                }
                books.push(book)
                return book
            }
        },
        addAuthor: {
            type: AuthorType, // return a book
            description: 'add a author',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                
            },
            resolve: (parent, args) => {
                const author = {
                    id: books.length + 1,
                    name: args.name,
                    
                }
                authors.push(author)
                return author
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

// const schema = new GraphQLSchema({
//     query: new GraphQLObjectType({
//         name: 'HelloGraphQL',
//         fields: () => ({
//             message: {
//                 type: GraphQLString,
//                 resolve: () => 'Hello Graphql!'
//             }
//         })
//     })
// })

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema
}));
app.listen(5000, () => console.log('Server is running...'));



