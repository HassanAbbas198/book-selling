const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const User = require("../models/user");

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  //we initialize fetchedUser because we cant access user outside the then block
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      /*i returned the response because I will add code after the if statement, i could wrap it in an else statement,
      but this will mean one more layer of nesting*/
      if (!user) {
        return res.status(401).json({
          message: "Auth failed!"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    //the bcrypt.compare return boolean
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed!"
        });
      }
      const token = jwt.sign(
        {
          email: fetchedUser.email,
          userId: fetchedUser._id,
          name: fetchedUser.name
        },
        "secret_this_should_be_longer",
        { expiresIn: "24d" }
      );
      //here we dont need to use "return" cz nothing will be execuded after it
      res.status(200).json({
        token: token,
        expiresIn: 2000000
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({
        message: "Auth failed!"
      });
    });
});

module.exports = router;