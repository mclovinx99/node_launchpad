const nodemailer = require('nodemailer');
const mailBody = require('../mails/unverifiedMail');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.user,
        pass: process.env.user
    }
});


const sendMail = (students,teachers) => {
    const mailOptions = {
        from: process.env.user,
        to: 'aditya.rathi.hestabit@gmail.com', //admin hardcorded for test
        subject: 'Alert! Unverified entires in database.',
        html: mailBody(teachers,students)
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
}

module.exports = sendMail;