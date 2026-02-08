import Database from "better-sqlite3";
import mysql, { Pool } from "mysql2/promise";
import path from "path";
import fs from "fs";

// Determine if we should use MySQL (Production) or SQLite (Local)
const USE_MYSQL = process.env.MYSQL_HOST !== undefined;

// SQLite Config
const SQLITE_DB_PATH = path.resolve(process.cwd(), "..", "server", "openml.db");

// Connection instances
let sqliteDb: Database.Database | null = null;
let mysqlPool: Pool | null = null;

/**
 * Initialize and get the database connection
 */
export async function getDb() {
  if (USE_MYSQL) {
    if (!mysqlPool) {
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
      console.log("[DB] Initialized MySQL Connection Pool");
    }
    return mysqlPool;
  } else {
    if (!sqliteDb) {
      if (!fs.existsSync(SQLITE_DB_PATH)) {
        console.warn(`[DB] Database not found at ${SQLITE_DB_PATH}.`);
      }
      sqliteDb = new Database(SQLITE_DB_PATH, {
        verbose:
          process.env.NODE_ENV === "development" ? console.log : undefined,
      });
      sqliteDb.pragma("journal_mode = WAL");
      console.log("[DB] Initialized SQLite Connection (WAL Mode)");
    }
    return sqliteDb;
  }
}

/**
 * Utility to run a query and return all results
 */
export async function queryAll<T>(
  sql: string,
  params: any[] = [],
): Promise<T[]> {
  const db = await getDb();
  if (USE_MYSQL) {
    const [rows] = await (db as Pool).execute(sql, params);
    return rows as T[];
  } else {
    return (db as Database.Database).prepare(sql).all(...params) as T[];
  }
}

/**
 * Utility to run a query and return the first result
 */
export async function queryOne<T>(
  sql: string,
  params: any[] = [],
): Promise<T | undefined> {
  const db = await getDb();
  if (USE_MYSQL) {
    const [rows] = await (db as Pool).execute(sql, params);
    const results = rows as any[];
    return results.length > 0 ? (results[0] as T) : undefined;
  } else {
    return (db as Database.Database).prepare(sql).get(...params) as
      | T
      | undefined;
  }
}

/**
 * Utility to execute a command (INSERT, UPDATE, DELETE)
 */
export async function execute(sql: string, params: any[] = []): Promise<any> {
  const db = await getDb();
  if (USE_MYSQL) {
    const [result] = await (db as Pool).execute(sql, params);
    return result;
  } else {
    return (db as Database.Database).prepare(sql).run(...params);
  }
}
