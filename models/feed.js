const mongoDB = require("../utils/database"); 
const ObjectId = require('mongodb').ObjectId; 
// const rootPath = require('../utils/path');


class Feed {
    constructor(title,content,userEmail){
        this.title = title;
        this.content = content,
        this.userEmail = userEmail;
        this.createdAt = Date.now();
        this.updatedAt = Date.now();
    }

    save(){        
         /** CONNECT TO DB */
         const db = mongoDB.getDb();
         return db.collection('feeds').insertOne(this);
    }

    static fetchAllFeeds(){
        /** CONNECT TO DB */
        const db = mongoDB.getDb();
        return db.collection('feeds').find().toArray();
    }

    static fetchAllFeedsEmailId(emailId){
        /** CONNECT TO DB */
        const db = mongoDB.getDb();
        return db.collection('feeds').find(
        {
            "userEmail":emailId
        }).toArray();
    }
}


module.exports = Feed;