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
                res
                .status(200)
                .next();
            }
            else{
                res
                .status(401)
                .json({message:'not allowed to access.'})
            }
        })
    }
}

module.exports.upload =  (req,res)=>{
    try{
            upload.single("myFile")(req,res,(err)=>{
                if(err){
                    console.log(err);
                }
                res
                .status(200)
                .json({message:"File uploaded"});
            });
    } catch(err){
        console.log(err);
    }
}