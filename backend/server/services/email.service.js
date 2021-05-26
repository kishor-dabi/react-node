"use strict";

const env = process.env.NODE_ENV;
console.log({ env });
const config = require(__dirname + '/../config/config.json')[env];

const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function emailService(body, email_to, subject) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: testAccount.user, // generated ethereal user
//       pass: testAccount.pass, // generated ethereal password
//     },
//   });

let transporter = await nodemailer.createTransport(config.email_conf);
    // console.log("------------------  email data " , config.email_conf);
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: config.email_conf.auth.user, // sender address
    to: `${email_to}`, // list of receivers
    subject: `${subject}`, // Subject line
    text: `${body}`, // plain text body
  });

  console.log("Message sent: %s", info.messageId);
 
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  return info

}

module.exports.emailService = emailService;
