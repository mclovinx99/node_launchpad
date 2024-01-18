const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const anita = await prisma.Teacher.upsert({
    where: { email: 'anita@gmail.com' },
    update: {},
    create: {
        email: 'anita@gmail.com',
        name: 'anita',
        address: 'Noida, sector 18',
        picture:'selfie.jpg',
        current_school:'XYZ',
        previous_school:'PQR',
        experience:'2 years',
        expertise:'English',
        students : {
            create:[
                {
                    email: 'sachin@gmail.com',
                    name: 'sachin',
                    address: 'Noida, sector 27',
                    picture:'me.jpg',
                    current_school:'XYZ',
                    previous_school:'PQR',
                    parents_details:'Mr Ak'
                },
                {
                    email: 'aditya@gmail.com',
                    name: 'Aditya',
                    address: 'Noida, sector 70',
                    picture:'me.jpg',
                    current_school:'XYZ',
                    previous_school:'PQR',
                    parents_details:'Mr Sanjiv'
                }
            ]
        }
    },
  })
  const nupur = await prisma.Teacher.upsert({
    where: { email: 'nupur@gmail.com' },
    update: {},
    create: {
        email: 'nupur@gmail.com',
        name: 'nupur',
        address: 'Noida, sector 18',
        picture:'selfie.jpg',
        current_school:'XYZ',
        previous_school:'PQR',
        experience:'2 years',
        expertise:'English',
        students : {
            create:[
                {
                    email: 'rachin@gmail.com',
                    name: 'rachin',
                    address: 'Noida, sector 2',
                    picture:'me.jpg',
                    current_school:'XYZ',
                    previous_school:'PQR',
                    parents_details:'Mr k'
                }
            ]
        }
    },
  })

  console.log({ nupur, anita})
}
async function secondSeed(){
    const riya = await prisma.Teacher.upsert({
        where: { email: 'riya@gmail.com' },
        update: {},
        create: {
            email: 'riya@gmail.com',
            name: 'riya',
            address: 'Noida, sector 1',
            picture:'selfie.jpg',
            current_school:'XYZ',
            previous_school:'PQR',
            experience:'2 years',
            expertise:'English'
        }
    })
    console.log({riya})
}
secondSeed()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })