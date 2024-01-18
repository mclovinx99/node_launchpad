const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });


module.exports.create_teacher = async(req,res) =>{
        upload.single('picture')(req, res, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'File upload failed' });
        }else{
            console.log("uploaded");
            console.log(req.body,"body");
            const data = req.body;
            const file =  req.file;
            helper_teacher(data,file,res);
        }
    });
}
const helper_teacher = async(obj,file,res)=>{
    try{
        console.log(obj,"data helper");
        const createdUser = await prisma.Teacher.create({
            data:{
                name: obj.name,
                email: res.locals.user,
                previous_school : obj.previous_school,
                current_school : obj.current_school,
                address : obj.address,
                picture : file.filename,
                experience : obj.experience
            }
        });
        return res
        .status(200)
        .json({
            message: 'Teacher created'
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
        const createdUser = await prisma.TeacherPassword.create({
            data:{
                name,
                password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
                email,
            }
        });
        res.status(200).json({
            message: 'Teacher Password created'
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
        const user = await prisma.TeacherPassword.findUnique({
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
module.exports.getTeachers = async(req,res)=>{
    try{
        const teachers = await prisma.Teacher.findMany();
        res
        .status(200)
        .json({teachers});
    }
    catch(err){
        res
        .status(400)
        .json({err});
    }
}
module.exports.updateDetails = async(req,res)=>{
    const{address,picture,experience,previous_school,current_school} = req.body;
    try{    
        const updateUser = await prisma.Teacher.update({
            where: {
              email: res.locals.user,
            },
            data: {
                address,
                picture,
                experience,
                previous_school,
                current_school
            }
          })
        res
        .status(200)
        .json({message:"updated details of teacher"});
    }
    catch(err)
    {
        res
        .status(400)
        .json({err});
    }
}

module.exports.deleteTeacher = async(req,res)=>{
    try{
        const deleteTeacherProfile = await prisma.Teacher.delete({
            where: {
              email: res.locals.user
            }
        })
        const deleteTeacherPassword = await prisma.TeacherPassword.delete({
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