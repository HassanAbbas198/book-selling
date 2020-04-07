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

exports.createUser = (req, res, next) => {
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
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.status(500).json({
          message: "Email already exists!",
        });
      }
      return bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          name: name,
          email: email,
          password: hashedPassword,
        });
        return user.save();
      });
    })
    .then((result) => {
      res.status(201).json({
        message: "User created!",
        result: result,
      });
      transporter
        .sendMail({
          to: email,
          from: "shop@hassan.com",
          subject: "Signup succeeded!",
          html: "<h1>You successfully signed up!</h1>",
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Invalid authentication credentials!",
      });
    });
};

exports.userLogin = (req, res, next) => {
  //  we initialize fetchedUser because we cant access user outside the then block
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      /*i returned the response because I will add code after the if statement, i could wrap it in an else statement,
      but this will mean one more layer of nesting*/
      if (!user) {
        return res.status(401).json({
          message: "Invalid Email address!",
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    // the bcrypt.compare return boolean
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Invalid password!",
        });
      }
      const token = jwt.sign(
        {
          email: fetchedUser.email,
          userId: fetchedUser._id,
          name: fetchedUser.name,
        },
        process.env.JWT_KEY,
        { expiresIn: "24d" }
      );
      // here we dont need to use "return" cz nothing will be execuded after it
      res.status(200).json({
        token: token,
        expiresIn: 2000000,
        userId: fetchedUser._id,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).json({
        message: "Authentication failed!",
      });
    });
};

exports.resetPassword = (req, res, next) => {
  const email = req.body.email;

  User.findOne({ email: email })
    .then((user) => {
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
          <p>You requested a password reset</p>
          <p>Click this link <a href="http://localhost:4200/auth/newPassword/${userId}">reset password</a> to set a new password.</p>
          `,
      });
      return res.status(200).json({
        status: "Success!",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Invalid!",
      });
    });
};

// exports.resetPassword = (req, res, next) => {
//   const email = req.body.email;
//   const userId = "";
//   // crypto.randomBytes(32, (err, buffer) => {
//   //   if (err) {
//   //     console.log(err);
//   //     return res.status(401).json({
//   //       message: "failed!",
//   //     });
//   //   }
//   //   const cryptoToken = buffer.toString("hex");
//   //   console.log(cryptoToken);
//   User.findOne({ email: email })
//     .then((user) => {
//       if (!user) {
//         return res.status(401).json({
//           message: "No account with that Email found",
//         });
//       }
//       // user.resetToken = cryptoToken;
//       // user.resetTokenExpiration = Date.now() + 3600000;
//       // return user.save();
//       userId = user._id;
//     })
//     .then((result) => {
//       transporter.sendMail({
//         to: email,
//         from: "shop@hassan.com",
//         subject: "Password Reset",
//         html: `
//     <p>You requested a password reset</p>
//     <p>Click this link <a href="http://localhost:4200/auth/newPassword/${userId}">reset password</a> to set a new password.</p>
//     `,
//       });
//       return res.status(200).json({
//         status: "Success!",
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

exports.newPassword = (req, res, next) => {
  const userId = req.params.userId;
  const password = req.body.password;
  let restUser;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).json({
      message: errors.array()[0].msg,
    });
  }

  User.findOne({ _id: userId })
    .then((user) => {
      restUser = user;
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      restUser.password = hashedPassword;
      return restUser.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Password updated succesfully!",
      });
    })
    .catch((err) => {
      res.status(401).json({
        message: "Invalid!",
      });
    });
};

// exports.newPassword = (req, res, next) => {
//   const userId = req.params.userId;
//   const password = req.body.password;
//   let resetUser;

//   User.findOne({ _id: userId })
//     .then((user) => {
//       resetUser = user;
//       return bcrypt.hash(password, 12);
//     })
//     .then((hashedPassword) => {
//       resetUser.password = hashedPassword;
//       return resetUser.save();
//     })
//     .then((result) => {
//       res.status(200).json({
//         message: "Password updated succesfully!",
//       });
//     })
//     .catch((err) => {
//       return res.status(401).json({
//         message: "Reset time expired. Try again!",
//       });
//     });
// };
