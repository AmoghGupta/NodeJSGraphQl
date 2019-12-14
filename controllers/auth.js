const {validationResult} = require("express-validator");
const Users = require("../models/user");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


/** Generates Random String to be used as salt for password */
let genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};


/**
 * hash password with sha512.
 */
let sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

const signUp = (req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({message: 'Validation failed',errors: errors.array()});
    }
    const email = req.body.email;
    const password = req.body.password;  
    const name =  req.body.name;


    bcrypt.hash(password, 10, async function(err, hashedSaltedPassword) {
        try{
            const user = new Users(email,hashedSaltedPassword,name);
            let response = await user.save();
            console.log(response);
            console.log("Saved User");
            //create a user entry in db
            return res.status(201).json(
                {
                    "message":"Sign up Success",
                }
            );
        }catch(err){
            console.log("Unable to create new user");
            return res.status(422).json({message: 'Failed to Signup'});
        }
    });  
};


const login = async (req, res, next)=>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({message: 'Validation failed',errors: errors.array()});
        }
        // get password and email entered by user
        const enteredEmail = req.body.email;
        const enteredPassword = req.body.password;  

        // fetch details from db for the entered password
        let userDetails = await Users.findUserByEmail(enteredEmail);
        if(userDetails.length>0){
            // get password and salt stored in DB
            let storedPassword = userDetails[0].password;
            //generate hash after applying salt for the entered password
            bcrypt.compare(enteredPassword, storedPassword, function (err, result) {
                if (result == true) {
                    
                    /** GENERATING A JWT TOKEN FOR USER AFTER SUCCESSFUL SIGNUP */
                    
                    // 1ST PARAM: storing user email and user id in the jwt token
                    // 2ND PARAM: is setting private key (some random string here we are setting as 'somesecret')
                    // which is used for signing the token, this key is know only to server
                    // 3RD PARAM: is expiry time of token 
                    const token = jwt.sign(
                        {
                                email:userDetails[0].email,
                                userId: userDetails[0]._id.toString()
                        },
                        'somesecret',
                        {
                            expiresIn: '1h'
                        }
                    );

                    return res.status(200).json({ token:token, message: 'Signin Success'});
                }else{
                    return res.status(200).json({message: 'Signin Failed'});
                }
            });

        }else{
            return res.status(200).json({message: 'Failed to Signin'});
        }
        console.log(userDetails);

    }catch(err){
        return res.status(422).json({message: 'Failed to Signin'});
    }
};


module.exports = {
    signUp:signUp,
    login:login
}


