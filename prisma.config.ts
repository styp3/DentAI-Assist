import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma CLI reads from `.env` by default; this project stores runtime config in `.env.local`.
loadEnv({ path: ".env.local", quiet: true });
loadEnv({ quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
