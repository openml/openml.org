import mysql, { Pool } from "mysql2/promise";

// MySQL connection pool (singleton)
let mysqlPool: Pool | null = null;

/**
 * Initialize and get the MySQL database connection pool.
 *
 * Configured via DATABASE_URL or individual MYSQL_* env vars.
 * Both local dev (Docker) and production use MySQL.
 */
export async function getDb(): Promise<Pool> {
  if (!mysqlPool) {
    // Parse DATABASE_URL if provided (format: mysql://user:pass@host:port/dbname)
    if (process.env.DATABASE_URL) {
      const url = new URL(process.env.DATABASE_URL);
      mysqlPool = mysql.createPool({
        host: url.hostname,
        user: url.username,
        password: url.password,
        database: url.pathname.slice(1), // Remove leading slash
        port: parseInt(url.port || "3306"),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    } else if (process.env.MYSQL_HOST) {
      mysqlPool = mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: parseInt(process.env.MYSQL_PORT || "3306"),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    } else {
      throw new Error(
        "[DB] No database configured. Set DATABASE_URL or MYSQL_HOST in your environment.",
      );
    }
  }
  return mysqlPool;
}

/**
 * Utility to run a query and return all results
 */
export async function queryAll<T>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  const pool = await getDb();
  const [rows] = await pool.execute(
    sql,
    params as (string | number | boolean | null)[],
  );
  return rows as T[];
}

/**
 * Utility to run a query and return the first result
 */
export async function queryOne<T>(
  sql: string,
  params: unknown[] = [],
): Promise<T | undefined> {
  const pool = await getDb();
  const [rows] = await pool.execute(
    sql,
    params as (string | number | boolean | null)[],
  );
  const results = rows as T[];
  return results.length > 0 ? (results[0] as T) : undefined;
}

/**
 * Utility to execute a command (INSERT, UPDATE, DELETE)
 */
export async function execute(
  sql: string,
  params: unknown[] = [],
): Promise<unknown> {
  const pool = await getDb();
  const [result] = await pool.execute(
    sql,
    params as (string | number | boolean | null)[],
  );
  return result;
}
