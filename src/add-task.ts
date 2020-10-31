import { config } from "./config";
import { Task } from "./types";
import sqlite from "better-sqlite3";
import { join } from "path";

const taskTableName = `${config.queueName}_tasks`;

const defaultTaskObject = (taskCmd?: string): Task => {
  if (taskCmd) return { taskCmd, status: "QUEUED" };
  return;
};

if (require.main === module)
  (async () => {
    const cmd = defaultTaskObject(process.argv[2]);
    console.log(addTask(cmd));
  })();

export function addTask(newTaskCmd?: Task): Task[] {
  const db = sqlite(join(__dirname, "..", "db.sqlite"));

  makeSureTablesExist(db);
  makeSureQueueExists(db);
  if (newTaskCmd) insertTask(newTaskCmd, db);

  return db.prepare(`SELECT * FROM ${taskTableName} WHERE status != 'FINISHED'`).all();
}

function insertTask(newTaskCmd: Task, db: sqlite.Database) {
  db.prepare(`INSERT INTO ${taskTableName} VALUES (@task_cmd, @status)`).run({
    task_cmd: newTaskCmd.taskCmd,
    status: newTaskCmd.status,
  });
}

function makeSureQueueExists(db: sqlite.Database) {
  const queueExists = db.prepare(`SELECT * FROM queues WHERE q_name = '${config.queueName}'`).get();

  if (!queueExists) {
    db.prepare(`INSERT INTO queues VALUES (@q_name, @status)`).run({
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
    `CREATE TABLE IF NOT EXISTS ${taskTableName} (
      task_cmd TEXT NOT NULL,
      status TEXT NOT NULL
    )`
  ).run();
}
