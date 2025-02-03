import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const initDB = async () => {
  return open({
    filename: "./audit.db",
    driver: sqlite3.Database,
  });
};

export const createAuditTable = async () => {
  const db = await initDB();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      auditAction TEXT,
      data TEXT,
      status TEXT,
      error TEXT,
      auditBy TEXT,
      auditOn TEXT
    )
  `);
  console.log(" Audit table created!");
};

export const insertAudit = async (
  auditAction,
  data,
  status,
  error,
  auditBy,
  auditOn
) => {
  const db = await initDB();
  const sql = `INSERT INTO audit_logs (auditAction, data, status, error, auditBy, auditOn) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [auditAction, data, status, error, auditBy, auditOn];

  try {
    await db.run(sql, values);
    console.log(" Audit inserted!");
  } catch (err) {
    console.error("Error inserting audit:", err);
  } finally {
    await db.close();
  }
};

export const getAudits = async () => {
  const db = await initDB();
  const sql = `SELECT * FROM audit_logs`;

  try {
    const rows = await db.all(sql);
    return rows;
  } catch (err) {
    console.error("Error retrieving audits:", err);
  } finally {
    await db.close();
  }
};
