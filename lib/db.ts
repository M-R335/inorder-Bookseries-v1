import { Pool } from "pg";

// Use a global variable to prevent multiple pools in development/build
declare global {
  // eslint-disable-next-line no-var
  var postgresPool: Pool | undefined;
}

const isProd = process.env.NODE_ENV === "production";

const host =
  process.env.PGHOST ||
  process.env.DB_HOST ||
  (!isProd ? "localhost" : undefined);

const user =
  process.env.PGUSER ||
  process.env.DB_USER ||
  (!isProd ? "appuser" : undefined);

const password =
  process.env.PGPASSWORD ||
  process.env.DB_PASSWORD ||
  (!isProd ? "post" : undefined);

const database =
  process.env.PGDATABASE ||
  process.env.DB_NAME ||
  (!isProd ? "book_series" : undefined);

const port = parseInt(
  process.env.PGPORT || process.env.DB_PORT || "5432",
  10
);

if (isProd && (!host || !user || !password || !database)) {
  console.error("Missing DB environment variables in production");
  throw new Error("Database configuration is incomplete for production");
}

// Use SSL for any non-localhost DB (RDS)
const useSSL = host !== "localhost";

const pool =
  global.postgresPool ||
  new Pool({
    host: host!,
    user: user!,
    password: password!,
    database: database!,
    port,
    max: 2, // Aggressively limit max connections for build
    idleTimeoutMillis: 1000,
    connectionTimeoutMillis: 5000,
    ssl: useSSL
      ? {
          rejectUnauthorized: false, // fine for RDS client-side
        }
      : false,
  });

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  // Don't exit process, just log
});

if (!isProd) {
  global.postgresPool = pool;
}

export default pool;
