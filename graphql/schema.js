/** BUILDING A SCHEMA */

const {buildSchema} = require("graphql");


/**
 * *****SCHEMA****************
 * IN GRAPHQL UI/POSTMAN NEEDS TO SEND TYPE AS "POST" ALWAYS
 * QUERY: IS LIKE A GET REQUEST (use this if you are not modifying anything in DB just fetching)
 * MUTATION: IS LIKE A POST REQUEST (use this if you are modifying anything in DB)
 */

 // ! exclamation is nothing but required symbol in graphql
module.exports = buildSchema(`

    type User {
        _id: ID
        name: String!
        email : String!
        password: String
    }

    type TokenInfo{
        message: String
        token: String
    }

    type Feed{
        _id:ID!
        title:String
        content:String
        userEmail:String
        createdAt:String
        updatedAt: String
    }

 
    type PostsData{
        Feeds:[Feed!]!
    }

    input UserInputData{
        email : String!
        name: String!
        password: String!
    }

    input UserLoginData{
        email : String!
        password: String!
    }

   

    type RootMutation {
        createUser(userInput:UserInputData):User!
    }
    type RootQuery{
        hello:String
        loginUser(userLoginData:UserLoginData):TokenInfo!
        getUserPosts:PostsData!
    }

    schema{
        query: RootQuery
        mutation :RootMutation
    }

`);


/*** SAMPLE QUERIES 
// http://localhost:8080/graphql

query {
  
    getUserPosts{
    allFeeds
    }


    loginUser(userLoginData: {email:"gupta.amogh15@gmail.com",password: "amogh_gupta15" })
    {
        message,
        token
    }
  
    hello
  
  
}


mutation{
  
  createUser(userInput: {email:"testtest.com", 
    name:"Testamogh123", 
    password: "amogh_gupta15" })
  {
    _id
    email
  }
  
}

**/