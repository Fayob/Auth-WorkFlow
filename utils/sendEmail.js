const nodemailer = require("nodemailer");
const Mailgun = require("mailgun.js");
const formData = require("form-data");

const API_KEY = "056dce4ed786644d0da165d71f0cff5b-38029a9d-fc459c3c";
const DOMAIN = "sandbox2671e686a5a7473da65e0ddd9a62f0e0.mailgun.org";

const sendEmail = async ({ to, subject, html }) => {
  const mailgun = new Mailgun(formData);
  const client = mailgun.client({ username: "Fayob", key: API_KEY });

  const messageData = {
    from: "FAYOB <adedejifavour6@gmail.com>",
    to,
    subject,
    html,
  };
  try {
    client.messages.create(DOMAIN, messageData);
  } catch (error) {
    console.log(error);
  }
};

const Nodemailer = async () => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "kathlyn.ziemann14@ethereal.email",
      pass: "GdFtDYhw7wxQ2f5uym",
    },
    // tls: {
    //   rejectUnauthorized: false,
    // },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });
};

module.exports = sendEmail;
