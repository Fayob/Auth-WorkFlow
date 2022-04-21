const sendEmail = require("./sendEmail");

const sendResetPasswordEmail = async ({ name, email, token, origin }) => {
  const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`;

  const message = `<p> Please Reset password By Clicking On The Following Link: <a href=${resetURL}>Reset Password</a></p>`;

  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h2> Hello, ${name} </h2> ${message}`,
  });
};

module.exports = sendResetPasswordEmail;
