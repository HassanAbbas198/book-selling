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
