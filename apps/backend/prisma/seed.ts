import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('abdan123', 10);

  // Seed Admin
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      role: Role.ADMIN,
      balance: 1000000.00, // Starting balance for admin
    },
  });

  // Seed User
  const user = await prisma.user.upsert({
    where: { username: 'abdan' },
    update: {},
    create: {
      username: 'abdan',
      password: userPassword,
      role: Role.USER,
      balance: 1000.00, // Starting balance for user
    },
  });

  console.log({ admin, user });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
