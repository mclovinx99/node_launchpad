const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

module.exports.user = async(req,res) =>{
    const {password,name} = req.body;
    console.log(password, name);
    try{
        const createdUser = await prisma.Admin.create({
            data:{
                name,
                Password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
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