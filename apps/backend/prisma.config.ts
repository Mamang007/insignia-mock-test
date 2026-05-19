import { defineConfig } from "@prisma/config";
import * as dotenv from "dotenv";
import path from "path";

// Prisma 6/7 skips automatic .env loading when a config file is present.
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export default defineConfig({
  schema: "./prisma/schema.prisma",
});
