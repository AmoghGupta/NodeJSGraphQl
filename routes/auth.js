const express = require("express");
const router = express.Router();
const {body} = require("express-validator")
const AuthController = require("../controllers/auth");
const Users = require("../models/user");


router.post("/signup",[
    body('name').trim().isLength({min: 5}),
    body('password').trim().isLength({min: 8}),
    body('email').trim().isEmail().isLength({min: 10}).custom(value => {
        return Users.findUserByEmail(value).then(user => {
          if (user.length) {
            return Promise.reject('E-mail already in use');
          }
        });
    })
],AuthController.signUp);


router.post("/login",[
  body('password').trim().isLength({min: 8}),
  body('email').trim().isEmail().isLength({min: 10}).custom(value => {
      return Users.findUserByEmail(value).then(user => {
        if (user.length == 0) {
          return Promise.reject('User doesnt exists');
        }
      });
  })
],AuthController.login);

module.exports = router;