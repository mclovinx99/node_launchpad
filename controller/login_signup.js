const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

module.exports.create_admin = async(req,res) =>{
    const {password, name, email} = req.body;
    try{
        const createdUser = await prisma.Admin.create({
            data:{
                name,
                Password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
                email,
            }
        });
        res.status(200).json({
            message: 'User created'
        })
    } catch(err){
        console.log(err);
    }finally{
        await prisma.$disconnect();
    }
}

module.exports.login = async(req,res)=>{
    const {email, password} = req.body;
    try{
        const user = await prisma.Admin.findUnique({
            where: {
                email: email
            }
        });
        console.log(user);
        if(bcrypt.compareSync(user && password,user.Password)){
            const token = jwt.sign({name:user.name},'se3ret',{expiresIn:3600})
            res
            .status(200)
            .json({message:'user found',token:token});
        }else{
            res
            .status(401)
            .json({message:'Incorrect password'});
        }

    }catch(err){
        console.log("err" +err);
    }
}

module.exports.authorize = async(req,res,next)=>{
    var headerExist = req.header.authorization;
    if(headerExist){
        let token = headerExist.split('.');
        jwt.verify(token,'se3ret',(decoded,err)=>{
            if(decoded)
            {
                res.locals.user = decoded.email;
                next();
            }
            else{
                res
                .status(401)
                .json({message:'not allowed to access.'})
            }
        })
    }
}

module.exports.assignTeacher = async(req,res)=>{
    const {teacherEmail, studentEmail} = req.body;
    try{
        const teacher = await prisma.Teacher.findUnique({
            where: {
                email: teacherEmail
            }
        });
        if(teacher) helper_assigner(teacher,studentEmail,res);
        else{
            res
            .status(400);
        }
    }catch(err){
        console.log("err" +err);
    }
}
const helper_assigner = async(teacher,studentEmail,res)=>{
    try{
        const student = await prisma.StudentsProfile.update({
            where: {
              email: studentEmail,
            },
            data: {
              teacher_id: teacher.id,
            }
        })
        console.log(student);
        console.log(teacher);
        res
        .status(200)
        .json({message:'teacher asssigned to student,student.name'})  
    }catch(err){
        console.log("err" +err);
    }
}