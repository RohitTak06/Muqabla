import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Seed Sports
  const sports = [
    { name: 'Football', description: 'Association football (soccer)', icon: '⚽' },
    { name: 'Basketball', description: 'Indoor court sport', icon: '🏀' },
    { name: 'Cricket', description: 'Bat-and-ball game', icon: '🏏' },
    { name: 'Tennis', description: 'Racket sport', icon: '🎾' },
    { name: 'Volleyball', description: 'Team sport with net', icon: '🏐' },
    { name: 'Badminton', description: 'Racquet sport', icon: '🏸' },
    { name: 'Table Tennis', description: 'Ping pong', icon: '🏓' },
    { name: 'Hockey', description: 'Field hockey', icon: '🏑' },
  ]

  for (const sport of sports) {
    await prisma.sport.upsert({
      where: { name: sport.name },
      update: {},
      create: sport,
    })
  }

  console.log('✅ Sports seeded successfully')

  // Create sample admin user
  const { hashPassword } = await import('../src/lib/auth')
  const hashedPassword = await hashPassword('admin123')

  await prisma.user.upsert({
    where: { email: 'admin@muqabla.com' },
    update: {},
    create: {
      email: 'admin@muqabla.com',
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user created (email: admin@muqabla.com, password: admin123)')

  // Create sample organizer
  await prisma.user.upsert({
    where: { email: 'organizer@muqabla.com' },
    update: {},
    create: {
      email: 'organizer@muqabla.com',
      username: 'organizer',
      password: await hashPassword('organizer123'),
      firstName: 'Event',
      lastName: 'Organizer',
      role: 'ORGANIZER',
    },
  })

  console.log('✅ Organizer user created (email: organizer@muqabla.com, password: organizer123)')

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
