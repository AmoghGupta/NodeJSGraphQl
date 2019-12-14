const {validationResult} = require("express-validator");
const Feed = require("../models/feed");

const getPosts = async (req, res, next)=>{
    const emailId = req.userEmail;
    const allFeeds = await Feed.fetchAllFeedsEmailId(emailId)
    return res.status(200).json(allFeeds);
};

const createPost = async (req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({message: 'Validation failed',errors: errors.array()});
    }

    // if(!req.file){
    //     const err= new Error("No image provided");
    //     err.statusCode = 422;
    //     throw err;
    // }
    // const imageUrl = req.file.path; 
    //reading the posted data (parsed using body parses which we have added)
    const title = req.body.title;
    const content = req.body.content;
    const emailId = req.userEmail;

    const feed =  new Feed(title,content,emailId);
    const response = await feed.save();
    console.log(response);
    console.log("Saved feed");
    //create a post in db
    return res.status(201).json(
        {
            "message":"post created successfully",
            "post": {
                id: new Date().toISOString(),
                response: response.ops
            }
        }
    );
};


module.exports = {
    getPosts:getPosts,
    createPost:createPost
}


