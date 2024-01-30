const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const nodemailer = require('nodemailer');
const mailbody = require('../mails/otpMaiil');


//configuring multer
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    },
});

const upload = multer({ storage: storage });


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.user,
        pass: process.env.pass
    }
});

module.exports.create_teacher = async (req, res) => {
    upload.single('picture')(req, res, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'File upload failed' });
        } else {
            const data = req.body;
            const file = req.file;
            console.log(file);
            helper_teacher(data, file, res);
        }
    });
}

//helper function
const helper_teacher = async (obj, file, res) => {
    try {
        console.log(obj, "data helper");
        const createdUser = await prisma.Teacher.create({
            data: {
                name: obj.name,
                email: obj.email,
                previous_school: obj.previous_school,
                current_school: obj.current_school,
                address: obj.address,
                picture: file.filename,
                experience: obj.experience
            }
        });
        return res
            .status(200)
            .json({
                message: 'Teacher created'
            })
    } catch (err) {
        console.log(err);
    } finally {
        await prisma.$disconnect();
    }
}

module.exports.create_password = async (req, res) => {
    const { password, email } = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000);

    try {
        const createdUser = await prisma.TeacherPassword.create({
            data: {
                otp,
                password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
                email,
            }
        });
        const mailOptions = {
            from: process.env.user,
            to: createdUser.email,
            subject: 'You have use this OTP to verify yourself.',
            html: mailbody(otp)
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        })
        res.status(200).json({
            message: 'Teacher Password created',
            json: createdUser.otp
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
        const user = await prisma.TeacherPassword.findUnique({
            where: {
                email: email
            }
        });
        console.log(user);
        if (bcrypt.compareSync(user && password, user.password)) {
            const token = jwt.sign({ email: user.email }, 'se3ret', { expiresIn: 3600 })
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
    var headerExist = req.headers.authorization;
    console.log(req.header.authorization)
    if (headerExist) {
        let token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, 'se3ret', (err, decoded) => {
            if (decoded) {
                console.log("decoded", decoded)
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
    else {
        res
            .status(401)
            .json({ message: "No token provided" });
    }
}

//get all teachers
module.exports.getTeachers = async (req, res) => {
    try {
        const teachers = await prisma.Teacher.findMany();
        res
            .status(200)
            .json({ teachers });
    }
    catch (err) {
        res
            .status(400)
            .json({ err });
    }
}

//get specific teacher
module.exports.getTeacher = async (req, res) => {

    const { email } = req.body;
    console.log(email)
    try {
        const teachers = await prisma.Teacher.findUnique({
            where: {
                email: email
            }
        });
        console.log(teachers);
        res
            .status(200)
            .json({ teachers });
    }
    catch (err) {
        console.log(err);
        res
            .status(400)
            .json({ err });
    }
}

//update details
module.exports.updateDetails = async (req, res) => {
    const { address, experience, previous_school, current_school } = req.body;
    try {
        const updateUser = await prisma.Teacher.update({
            where: {
                email: res.locals.user,
            },
            data: {
                address,
                experience,
                previous_school,
                current_school
            }
        })
        res
            .status(200)
            .json({ message: "updated details of teacher" });
    }
    catch (err) {
        res
            .status(400)
            .json({ err });
    }
}

module.exports.deleteTeacher = async (req, res) => {
    try {
        const deleteTeacherProfile = await prisma.Teacher.delete({
            where: {
                email: res.locals.user
            }
        })
        const deleteTeacherPassword = await prisma.TeacherPassword.delete({
            where: {
                email: res.locals.user
            }
        })
        res
            .status(200)
            .json({ message: "deleted" });
    } catch (err) {
        console.log(err);
        res
            .status(400)
            .json({ err });

    }
}


//verify teacher's email
module.exports.verifyOTP = async (req, res) => {
    const { OTP, email } = req.body;
    try {
        const user = await prisma.TeacherPassword.findUnique({
            where: {
                email: email
            }
        });
        console.log("backend", user);
        if (user.otp == OTP) {
            res
                .status(200)
                .json({ message: 'OTP found' });
        } else {
            res
                .status(319)
                .json({ success: false, data: null, error: '', message: 'Incorrect OTP' });
        }

    } catch (err) {
        console.log("err" + err);
    }
}