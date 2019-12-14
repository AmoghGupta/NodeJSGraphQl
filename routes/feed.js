const express = require("express");
const router = express.Router();
const {body} = require("express-validator")
const feedController = require("../controllers/feed");
const isAuthorized = require("../middlewares/is-auth");


router.get("/posts",isAuthorized.isAuthenticated, feedController.getPosts);

/** params (route, middlewares(here we are using custom authenicator middleware 
 * and validator) controller) */
router.post("/posts",isAuthorized.isAuthenticated,[
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5}),
],feedController.createPost);

// router.post("/posts",[
//     body('title').trim().isLength({min: 5}),
//     body('content').trim().isLength({min: 5}),
//     body('email').trim().isEmail().isLength({min: 10})
// ],feedController.createPost);




module.exports = router;