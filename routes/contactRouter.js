const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
require('dotenv').config

router.get('/', (req, res) => res.send({ msg: `send contact using POST` }));

router.post('/contact', (req, res) => {
    const {name, email, message} = req.body
var transporter = nodemailer.createTransport({
  service: 'icloud',
  host: "smtp.icloud.com",
    port: 465,
    secure: true,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

var mailOptions = {
  from: email,
  to: 'reeseabrahams1997@icloud.com',
  subject: 'Sending Email using Node.js',
  text: `${name} has message you, saying:

  ${message}`,
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
    res.status(400).send({ msg: "Email could not be sent" + error });
  } else {
    console.log("Email sent: " + info.response);
     res.send({ msg: "Message sent successfully" });
  }
}); 
})

module.exports = router;