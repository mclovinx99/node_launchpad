const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const findByMail = async (email) =>{
    try {
        const teacher = await prisma.Teacher.findUnique({
            where: {
                email: email
            }
        });
        return teacher;
    } catch (error) {
        console.log(error);
    }
}