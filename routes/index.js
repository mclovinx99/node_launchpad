const express = require('express');
const Router = express.Router();
const add_user = require('../controller/admin_controller');
const add_student = require('../controller/students_controller');
const add_teacher = require('../controller/teachers_controller');

//admin routes
Router
.route('/create')
.post(add_user.create_admin);

Router
.route('/login')
.post(add_user.login);

Router
.route('/assignTeacher')
.post(add_user.assignTeacher);

Router
.route('/verifyStudent')
.post(add_user.verifyStudent);

Router
.route('/verifyTeacher')
.post(add_user.verifyTeacher);

Router
.route('/getList')
.get(add_user.unverifiedList);


//students route
Router
.route('/studentSignup')
.post(add_student.create_password);

Router
.route('/studentLogin')
.post(add_student.login);

Router
.route('/createStudent')
.post(add_student.authorize,add_student.create_student);


//teachers route
Router
.route('/teacherSignup')
.post(add_teacher.create_password);

Router
.route('/teacherLogin')
.post(add_teacher.login);

Router
.route('/createTeacher')
.post(add_teacher.authorize,add_teacher.create_teacher);

Router
.route('/getTeachers')
.get(add_teacher.getTeachers);

Router
.route('/updateTeachers')
.put(add_teacher.updateDetails);

Router
.route('/deleteTeacher')
.delete(add_teacher.deleteTeacher);

module.exports = Router;