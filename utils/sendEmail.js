const nodemailer = require("nodemailer");
const { config } = require("../config/config");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    auth: {
      user: config.smtp.email,
      pass: config.smtp.password,
    },
  });

  const message = {
    from: `${config.smtp.from_name} <${config.smtp.from_email}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
};

module.exports = { sendEmail };
