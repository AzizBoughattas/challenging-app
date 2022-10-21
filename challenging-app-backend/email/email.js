const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main(userEmails) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //   let testAccount = await nodemailer.createTestAccount();

  const output = `<p>Hello fellow colleaguesl</p>
 <p>I hope this email finds you well</p> 
  <p>You are invited to pass an assessment. Please check your personal space to access it. Thank you in advance and have a good day.</p>
  <p>Sincerely
  </p>`;
  const plainText = `Hello fellow colleagues,I hope this email finds you well
  You are invited to pass an assessment. Please check your personal space to access it. Thank you in advance and have a good day.
  Sincerely
  `;

  console.log(userEmails);

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.EMAIL_PASS, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "Admin <challenging.app@gmail.com>", // sender address
    to: userEmails, // list of receivers
    subject: "Assessment Invitation", // Subject line
    text: plainText, // plain text body
    html: output, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = main;
