const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const mailbody = require('../mails/genericMail');



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.user,
        pass: 'aofvbrjqrslzbavz'
    }
});

module.exports.create_admin = async (req, res) => {
    const { password, name, email } = req.body;
    try {
        const createdUser = await prisma.Admin.create({
            data: {
                name,
                Password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
                email,
            }
        });
        res.status(200).json({
            message: 'User created'
        })
    } catch (err) {
        console.log(err);
    } finally {
        await prisma.$disconnect();
    }
}

module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.Admin.findUnique({
            where: {
                email: email
            }
        });
        console.log(user);
        if (bcrypt.compareSync(user && password, user.Password)) {
            const token = jwt.sign({ name: user.name }, 'se3ret', { expiresIn: 3600 })
            res
                .status(200)
                .json({ message: 'user found', token: token });
        } else {
            res
                .status(401)
                .json({ message: 'Incorrect password' });
        }

    } catch (err) {
        console.log("err" + err);
    }
}

module.exports.authorize = async (req, res, next) => {
    var headerExist = req.header.authorization;
    if (headerExist) {
        let token = headerExist.split('.');
        jwt.verify(token, 'se3ret', (decoded, err) => {
            if (decoded) {
                res.locals.user = decoded.email;
                next();
            }
            else {
                res
                    .status(401)
                    .json({ message: 'not allowed to access.' })
            }
        })
    }
}
module.exports.assignTeacher = async (req, res) => {
    const { teacherEmail, studentEmail } = req.body;
    try {
        // const teacher= TeacherModel.findByMail(email);    
        const teacher = await prisma.Teacher.findUnique({
            where: {
                email: teacherEmail
            }
        });
        if (teacher) {
            console.log("teacher", teacher);
            console.log("studentEmail", studentEmail);
            helper_assigner(teacher, studentEmail, res);
        }
        else {
            res
                .status(400);
        }
    } catch (err) {
        console.log("err" + err);
    }
}
const helper_assigner = async (teacher, studentEmail, res) => {
    try {
        const student = await prisma.StudentsProfile.update({
            where: {
                email: studentEmail,
            },
            data: {
                teacher_id: teacher.id,
            }
        })
        res
            .status(200)
            .json({ message: 'teacher asssigned to student,student.name' });
        assignedMail(teacher, student);
    } catch (err) {
        console.log("err" + err);
    }
}
module.exports.verifyStudent = async (req, res) => {
    const { studentEmail } = req.body;
    try {
        const student = await prisma.StudentsProfile.update({
            where: {
                email: studentEmail,
            },
            data: {
                verified: true,
            }
        })
        res
            .status(200)
            .json({ message: 'student verified' });
        verificationMail(student);
    } catch (err) {
        res
            .status(400)
        console.log(err)
    }
}
module.exports.verifyTeacher = async (req, res) => {
    const { teacherEmail } = req.body;
    try {
        const teacher = await prisma.Teacher.update({
            where: {
                email: teacherEmail,
            },
            data: {
                verified: true,
            }
        })
        res
            .status(200)
            .json({ message: 'teacher verified' });
        verificationMail(teacher);
    } catch (err) {
        res
            .status(400)
            .json(err);
    }
}

module.exports.unverifiedList = async (req, res) => {
    let teacher, student;
    try {
        const teachers = await prisma.Teacher.findMany({
            where: {
                verified: null
            }
        });
        const students = await prisma.StudentsProfile.findMany({
            where: {
                verified: null
            }
        });
        teacher = teachers;
        student = students;
        res
        .status(200);
    }
    catch (err) {
        console.log(err);
    }
    return {teacher,student};
}

//helper function for mailing verification
const verificationMail = (role) => {
    const mailOptions = {
        from: process.env.user,
        to: role.email,
        subject: 'You have been verified!',
        text: 'Hi you been verified.'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
}

//helper function for mailing assigning of student
const assignedMail = (teacher, student) => {
    const mailOptions = {
        from: process.env.user,
        to: teacher.email,
        subject: 'New student assigned.',
        // text: 'Hi ' + `${teacher.name}` +', you have been assigned a new student: '+ `${student.name}`
        html: mailbody(teacher,student)
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
}
