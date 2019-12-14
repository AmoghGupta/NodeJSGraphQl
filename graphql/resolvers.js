const Users = require("../models/user");
const bcrypt = require('bcrypt');
const Feed = require("../models/feed");
/** validator package for validating the request user input info */
const validator = require('validator');
const jwt = require('jsonwebtoken');

/** RESOLVERS ARE LIKE CONTROLLERS ALL DATA HANDLING LOGIC IS WRITTEN HERE IN GRAPHQL */
module.exports = {
    
    
    hello(){
        return "hello world"
    },

    async getUserPosts(args, req){
        let jwtToken = req.header('Authorization');
        const errors = [];
        console.log("**********************JWT Start***************");
        console.log(jwtToken);
        console.log("**********************JWT End***************");
        if (jwtToken){
            // decode the token using the secret 
            let decodedValue = jwt.verify(jwtToken, 'somesecret');        
            
            if(!decodedValue){
                errors.push({message: "Unauthorized Request"});
            }

            if(errors.length>0){
                const error = new Error("Unauthorized Invalid Request");
                error.data = errors;
                error.code = 422;
                throw error; 
            }
    
            // if reached here that means user is authenticated
            // storing user information in req object
            req.userEmail = decodedValue.email;
            const Feeds = await Feed.fetchAllFeedsEmailId(req.userEmail);
            console.log("**********************Feeds Data Start***************");
            console.log(Feeds);
            console.log("**********************Feeds Data End***************");
    
            
            return {"Feeds":Feeds};
        }else{
            errors.push({message: "Unauthorized Request"});
            
            if(errors.length>0){
                const error = new Error("Unauthorized Invalid Request");
                error.data = errors;
                error.code = 422;
                throw error; 
            }
        }
    },


    async loginUser(args, req){
        const email = args.userLoginData.email;
        const password = args.userLoginData.password;
        const errors = [];
        /** Validator email*/
        if(!validator.isEmail(email)){
            errors.push({message: "Email invalid"});
        }
        if(errors.length>0){
            const error = new Error("Invalid Input");
            error.data = errors;
            error.code = 422;
            throw error; 
        }

        /** Test if user exists */
        const existingUser = await Users.findUserByEmail(email);
        if (!existingUser.length) {
            const error = new Error("E-mail doesnt exists");
            throw error;
        }
        let storedPassword = existingUser[0].password;
        let result = await bcrypt.compare(password, storedPassword);
        
        if (result == true) {
            const token = jwt.sign(
                {
                        email:existingUser[0].email,
                        userId: existingUser[0]._id.toString()
                },
                'somesecret',
                {
                    expiresIn: '1h'
                }
            );
            console.log(token);
            let obj = {
                "message": 'Signin Success',
                "token":token
            }
            return  obj;
        }
    },


    async createUser(args, req){
        const email = args.userInput.email;
        const name = args.userInput.name;
        const password = args.userInput.password;
        const errors = [];

        /** Validator email*/
        if(!validator.isEmail(email)){
            errors.push({message: "Email invalid"});
        }
        /** Validator Password*/
        if(validator.isEmpty(password) || !validator.isLength(password, {min: 5})){
            errors.push({message: "Invalid Password"});
        }
        if(errors.length>0){
            const error = new Error("Invalid Input");
            error.data = errors;
            error.code = 422;
            throw error; 
        }

        /** Test if user already exists */
        const existingUser = await Users.findUserByEmail(email);
        if (existingUser.length) {
            const error = new Error("E-mail already in use");
            throw error;
        }
        

        const hashedSaltedPassword = await bcrypt.hash(password, 10);  
        const user = new Users(email,hashedSaltedPassword,name);
        let response = await user.save();
        console.log("******************");
        console.log(response.ops[0]);
        console.log("******************");
        /** returing the user object as per the schema */
        return {...response.ops[0]};
    }
    
    // hello(){
    //     return {
    //         text: "hello world",
    //         views: 123
    //     }
    // }
}