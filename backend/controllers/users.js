const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { validationResult } = require("express-validator/check");

// sending emails
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

const User = require("../models/user");

exports.createUser = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  // gathering all the erros
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: errors.array()[0].msg,
    });
  }
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(500).json({
        message: "Email already exists!",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });
    const result = await newUser.save();
    res.status(201).json({
      message: "User created!",
      result: result,
    });
    transporter.sendMail({
      to: email,
      from: "shop@hassan.com",
      subject: "Signup succeeded!",
      html: `
          <h1>Welcome, ${name}! </h1>
          <p>Glad to have you on board.</p>
          <p>Thank you for signing up</p>
          `,
    });
  } catch (error) {
    res.status(500).json({
      message: "Invalid authentication credentials!",
    });
  }
};

exports.userLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    /* i returned the response because I will add code after the if statement, i could wrap it in an else statement, but this will mean one more layer of nesting */
    if (!user) {
      return res.status(401).json({
        message: "Invalid Email address!",
      });
    }
    const isEqual = await bcrypt.compare(req.body.password, user.password);
    // the bcrypt.compare returns a boolean
    if (!isEqual) {
      return res.status(401).json({
        message: "Invalid password!",
      });
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id,
        name: user.name,
      },
      process.env.JWT_KEY,
      { expiresIn: "24d" }
    );
    // here we dont need to use "return" cz nothing will be execuded after it
    res.status(200).json({
      token: token,
      expiresIn: 2000000,
      userId: user._id,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: "Authentication failed!",
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        message: "No account with that Email found",
      });
    }
    const userId = user._id;
    transporter.sendMail({
      to: email,
      from: "shop@hassan.com",
      subject: "Password Reset",
      html: `
          <p>Dear user,</p>
          <p>You requested a password reset</p>
          <p>Click the following link <a href="http://localhost:4200/auth/newPassword/${userId}">reset password</a> to set a new password.</p>
          <p>Thank you!</p>
          `,
    });
    return res.status(200).json({
      status: "Success!",
    });
  } catch (err) {
    res.status(500).json({
      message: "Invalid!",
    });
  }
};

exports.newPassword = async (req, res, next) => {
  const userId = req.params.userId;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: errors.array()[0].msg,
    });
  }

  try {
    const user = await User.findOne({ _id: userId });
    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password updated succesfully!",
    });
  } catch (err) {
    res.status(401).json({
      message: "Invalid!",
    });
  }
};
