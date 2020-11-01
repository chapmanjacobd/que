import sqlite from "better-sqlite3";
import { join } from "path";
import { config } from "./config";

export function init() {
  const db = sqlite(join(__dirname, "..", "db.sqlite"));

  makeSureTablesExist(db);
  makeSureQueueExists(db);

  return db;
}

function makeSureQueueExists(db: sqlite.Database) {
  const queueExists = db.prepare(`SELECT * FROM queues WHERE q_name = '${config.queueName}'`).get();

  if (!queueExists) {
    db.prepare(`INSERT INTO queues (q_name, status) VALUES (@q_name, @status)`).run({
      q_name: config.queueName,
      status: "RUNNING",
    });
  }
}

function makeSureTablesExist(db: sqlite.Database) {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS queues (
      q_name TEXT NOT NULL PRIMARY KEY,
      status TEXT NOT NULL
    )`
  ).run();

  db.prepare(
    `CREATE TABLE IF NOT EXISTS ${config.taskTableName} (
      task_cmd TEXT NOT NULL,
      status TEXT NOT NULL,
      exit_code INTEGER,
      stdout TEXT,
      stderr TEXT
    )`
  ).run();
}
