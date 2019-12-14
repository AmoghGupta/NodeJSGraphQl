const mongoDB = require("../utils/database"); 
const ObjectId = require('mongodb').ObjectId; 
// const rootPath = require('../utils/path');


class Users {
    constructor(email,hashedSaltedPassword,name){
        this.email = email;
        this.password = hashedSaltedPassword;
        this.name = name;
    }

    save(){        
         /** CONNECT TO DB */
         const db = mongoDB.getDb();
         return db.collection('users').insertOne(this);
    }

    static fetchAllFeeds(){
        /** CONNECT TO DB */
        const db = mongoDB.getDb();
        return db.collection('users').find().toArray();
    }

    static findUserByEmail(emailId){
            const db = mongoDB.getDb();
            return db.collection('users').find(
            {
                "email":emailId
            }).toArray();
    }

    // static fetchAllOrdersByEmailId(emailId){
    //     /** CONNECT TO DB */
    //     const db = mongoDB.getDb();
    //     return db.collection('orders').find(
    //     {
    //         "userEmail":emailId
    //     }).toArray();
    // }
}


module.exports = Users;