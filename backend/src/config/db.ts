import { Pool, QueryResult, QueryResultRow } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

// Start database connection
export async function connect(): Promise<void> {
  try {
    await pool.connect();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}

// SQL query executer
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  const result = await pool.query<T>(text, params);
  const duration = Date.now() - start;

  console.log("Executed query", {
    text,
    duration,
    rows: result.rowCount,
  });

  return result;
}

// Close database connection
export async function disconnect(): Promise<void> {
  await pool.end();
  console.log("Disconnected from the database");
}

// Handle uncaught errors
pool.on("error", (err) => {
  console.error("Unexpected database error", err);
  process.exit(1);
});

export { pool };
