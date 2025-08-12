import dotenv from "dotenv";

export const loadEnv = () => {
  const result = dotenv.config();
  if (result.error) {
    throw new Error("Failed to load environment variables");
  }
};

interface Config {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
  jwtSecret: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "",
};

export default config;
