import type { Config } from 'drizzle-kit'

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  breakpoints: true,
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!.replace(
      '?sslaccept=strict',
      '?ssl={"rejectUnauthorized":true}'
    ),
  },
  driver: 'mysql2',
} satisfies Config
