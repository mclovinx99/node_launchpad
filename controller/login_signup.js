const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

module.exports.user = async(req,res) =>{
    const password = req.body.Password;
    try{
        const createdUser = await prisma.signup.create({
            data:{
                FirstName : req.body.FirstName,
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