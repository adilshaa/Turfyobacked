const nodemailer = require("nodemailer");
require("dotenv").config();
const composeEmailToStaff = (data) => {
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email_id,
      pass: process.env.pass,
    },
  });

  let mailDetails = {
    from: `${data.resEmail}`,
    to: `${data.staffEmail}`,
    subject: "Welcome Mail ",
    text: `Welcome to ${data.resName} mr ${data.staffname}`,
  };

  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log("Error Occurs");
      console.log(err);
    } else {
      console.log("Email sent successfully");
    }
  });
};

module.exports = { composeEmailToStaff };
