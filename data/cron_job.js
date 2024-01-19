const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const offloader = require('./offloader')


function logMessage() {
 console.log('Cron job executed at:', new Date().toLocaleString());
}
// Schedule the cron job to run every minute
const schedule = cron.schedule('*/1 */1 * * *', async() => {
    logMessage();
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
        offloader(students,teachers);
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = schedule;