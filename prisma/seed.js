const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const aditya = await prisma.Students.upsert({
    where: { email: 'aditya@gmail.com' },
    update: {},
    create: {
      email: 'aditya@gmail.com',
      name: 'Aditya',
      address: 'Noida, sector 70',
      picture:'me.jpg',
      current_school:'XYZ',
      previous_school:'PQR',
      parents_details:'Mr Sanjiv',
      assigned_teacher :{
        create:{
            email: 'sushma@gmail.com',
            name: 'sushma',
            address: 'Noida, sector 18',
            picture:'selfie.jpg',
            current_school:'XYZ',
            previous_school:'PQR',
            experience:'2 years',
            expertise:'English',
        }
      }
    },
  })
  const sachin = await prisma.Students.upsert({
    where: { email: 'sachin@gmail.com' },
    update: {},
    create: {
      email: 'sachin@gmail.com',
      name: 'sachin',
      address: 'Noida, sector 27',
      picture:'me.jpg',
      current_school:'XYZ',
      previous_school:'PQR',
      parents_details:'Mr Ak',
      assigned_teacher :{
        create:{
            email: 'anita@gmail.com',
            name: 'anita',
            address: 'Noida, sector 18',
            picture:'selfie.jpg',
            current_school:'XYZ',
            previous_school:'PQR',
            experience:'2 years',
            expertise:'English',
        }
      }
    },
  })
//   const sushma = await prisma.Teacher.upsert({
//     where: { email: 'sushma@gmail.com' },
//     update: {},
//     create: {
//       email: 'sushma@gmail.com',
//       name: 'sushma',
//       address: 'Noida, sector 18',
//       picture:'selfie.jpg',
//       current_school:'XYZ',
//       previous_school:'PQR',
//       parents_details:'Mr Ak',
//       experience:'2 years',
//       expertise:'English',
//       students : {
//         create: [
//             {}
//         ]
//       }
//     },
//   })

  console.log({ aditya, sachin})
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })