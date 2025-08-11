import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const checkDatabaseConnection = async () => {
  try {
    await db.$connect();
  } catch (error) {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  }
};

export { checkDatabaseConnection };
export default db;
