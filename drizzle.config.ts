import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/schema/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  schemaFilter: ["academia", "auditoria","analitica", "clinica", "seguridad","soporte"],
});