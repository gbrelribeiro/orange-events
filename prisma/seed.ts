/* prisma/seed.ts */

import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });

const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL!;
  const password = process.env.SUPER_ADMIN_PASSWORD!;
  const firstName = process.env.SUPER_ADMIN_FIRST_NAME!;
  const lastName = process.env.SUPER_ADMIN_LAST_NAME!;

  if (!email || !password || !firstName || !lastName) throw new Error("Variáveis de ambiente do admin não configuradas");

  const exists = await prisma.admin.findUnique({
    where: { email },
  });

  if (exists) {
    console.log("SUPER_ADMIN já existe.");
    return;
  };

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.admin.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
    },
  });

  console.log("SUPER_ADMIN criado com sucesso");
};

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });