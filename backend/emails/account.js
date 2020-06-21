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

exports.welcomeEmail = (email, name) => {
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
};

exports.resetPassword = (email, userId) => {
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
};
