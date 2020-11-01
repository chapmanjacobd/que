import { config } from "./config";
import { Task } from "./types";
import sqlite from "better-sqlite3";
import { join } from "path";

if (require.main === module)
  (async () => {
    const cmd = process.argv[2];
    console.log(addTask({ newTaskCmd: cmd }));
  })();

export function addTask({
  newTaskCmd,
  queueName,
}: { newTaskCmd?: string; queueName?: string } = {}): Task[] {
  const taskTableName = `${queueName ?? config.queueName}_tasks`;

  const db = sqlite(join(__dirname, "..", "db.sqlite"));

  makeSureTablesExist(db, taskTableName);
  makeSureQueueExists(db);
  if (newTaskCmd) insertTask(db, newTaskCmd, taskTableName);

  return db.prepare(`SELECT rowid, * FROM ${taskTableName} WHERE status != 'FINISHED'`).all();
}

function insertTask(db: sqlite.Database, newTaskCmd: string, taskTableName: string) {
  db.prepare(`INSERT INTO ${taskTableName} (task_cmd, status) VALUES (@task_cmd, @status)`).run({
    task_cmd: newTaskCmd,
    status: "QUEUED",
  });
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

function makeSureTablesExist(db: sqlite.Database, taskTableName: string) {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS queues (
      q_name TEXT NOT NULL PRIMARY KEY,
      status TEXT NOT NULL
    )`
  ).run();

  db.prepare(
    `CREATE TABLE IF NOT EXISTS ${taskTableName} (
      task_cmd TEXT NOT NULL,
      status TEXT NOT NULL,
      exit_code INTEGER,
      stdout TEXT,
      stderr TEXT
    )`
  ).run();
}
