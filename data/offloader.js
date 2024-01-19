const nodemailer = require('nodemailer');
const mailBody = require('../mails/unverifiedMail');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.user,
        pass: 'aofvbrjqrslzbavz'
    }
});


const sendMail = (students,teachers) => {
    students.map((student)=>{
        console.log(student.name);
    })
    teachers.map((teacher)=>{
        console.log(teacher.name);
    })
    const mailOptions = {
        from: process.env.user,
        to: 'aditya.rathi.hestabit@gmail.com',
        subject: 'Alert! Unverified entires in database.',
        // text: `${students}${teachers}`
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