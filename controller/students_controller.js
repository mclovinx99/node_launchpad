const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });


module.exports.create_student = async(req,res) =>{
             upload.single('picture')(req, res, (err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: 'File upload failed' });
                }else{
                    console.log("uploaded");
                    console.log(req.body,"body");
                    const data = req.body;
                    const file =  req.file;
                    helper_student(data,file,res);
                }
            });
}
const helper_student = async(obj,file,res)=>{
    try{
        console.log(obj,"data helper");
        console.log(res.locals.email);
        const createdUser = await prisma.StudentsProfile.create({
            data:{
                name: obj.name,
                email: res.locals.user,
                parents_details :obj.parents_details,
                previous_school : obj.previous_school,
                current_school : obj.current_school,
                address : obj.address,
                picture : file.filename
            }
        });
        return res
        .status(200)
        .json({
            message: 'Student created'
        })
    } catch(err){
        console.log(err);
    }finally{
        await prisma.$disconnect();
    }
}
module.exports.create_password = async(req,res) =>{
    const {password, name, email} = req.body;
    try{
        const createdUser = await prisma.StudentPassword.create({
            data:{
                name,
                password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
                email,
            }
        });
        res.status(200).json({
            message: 'Student Password created'
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
        const user = await prisma.StudentPassword.findUnique({
            where: {
                email: email
            }
        });
        console.log(user);
        if(bcrypt.compareSync(user && password,user.password)){
            const token = jwt.sign({email:user.email},'se3ret',{expiresIn:3600})
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
    var headerExist = req.headers.authorization;
    console.log(req.header.authorization)
    if(headerExist){
        let token = req.headers.authorization.split(' ')[1];
        jwt.verify(token,'se3ret',(err,decoded)=>{
            if(decoded)
            {
                console.log("decoded",decoded)
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
    else
    {
        res
        .status(401)
        .json({message:"No token provided"});
    }
}
module.exports.getStudents = async(req,res)=>{
    try{
        const students = await prisma.StudentsProfile.findMany();
        res
        .status(200)
        .json({students});
    }
    catch(err){
        res
        .status(400)
        .json({err});
    }
}
module.exports.updateDetails = async(req,res)=>{
    const{address,picture,previous_school,current_school} = req.body;
    try{    
        const updateUser = await prisma.StudentsProfile.update({
            where: {
              email: res.locals.user,
            },
            data: {
                address,
                picture,
                previous_school,
                current_school
            }
          })
        res
        .status(200)
        .json({message:"updated details of student"});
    }
    catch(err)
    {
        res
        .status(400)
        .json({err});
    }
}

module.exports.deleteStudent = async(req,res)=>{
    try{
        const deleteStudentProfile = await prisma.StudentsProfile.delete({
            where: {
              email: res.locals.user
            }
        })
        const deleteStudentPassword = await prisma.StudentPassword.delete({
            where:{
                email:res.locals.user
            }
        })
        res
        .status(200)
        .json({message:"deleted"});
    }catch(err)
    {
        res
        .status(400)
        .json({err});
    }
}