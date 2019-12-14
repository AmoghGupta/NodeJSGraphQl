const jwt = require('jsonwebtoken');

const isAuthenticated =  (req, res, next)=>{
    let jwtToken = req.header('Authorization');
    console.log(jwtToken);
    if (jwtToken){
        // decode the token using the secret 
        let decodedValue = jwt.verify(jwtToken, 'somesecret');        
        
        if(!decodedValue){
            return res.status(401).json({message: 'Unauthorized'});
        }

        // if reached here that means user is authenticated
        // storing user information in req object
        req.userEmail = decodedValue.email;
        req.userId = decodedValue.userId;
        
        // successfully move to next middleware
        next();
    }else{
        return res.status(401).json({message: 'Unauthorized'});
    }
}

module.exports = {
    isAuthenticated:isAuthenticated
};