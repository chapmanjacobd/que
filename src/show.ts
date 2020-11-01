import { config } from "./config";
import sqlite from "better-sqlite3";
import { join } from "path";

if (require.main === module)
  (async () => {
    showTasks();
  })();

export function showTasks(queueName?: string) {
  const taskTableName = `${queueName ?? config.queueName}_tasks`;

  const db = sqlite(join(__dirname, "..", "db.sqlite"));

  const runningTasks = db
    .prepare(`SELECT rowid, * FROM ${taskTableName} WHERE status = 'RUNNING'`)
    .all();
  const failedTasks = db
    .prepare(`SELECT rowid, * FROM ${taskTableName} WHERE status = 'FAILED'`)
    .all();
  const queuedTasks = db
    .prepare(`SELECT rowid, * FROM ${taskTableName} WHERE status = 'QUEUED'`)
    .all();
  const completeTasks = db
    .prepare(`SELECT rowid, * FROM ${taskTableName} WHERE status = 'COMPLETE'`)
    .all();

  if (process.argv.includes("json"))
    return console.log({ runningTasks, failedTasks, queuedTasks, completeTasks });

  console.log("Running Tasks:");
  console.table(runningTasks.map((t) => truncateTask(t)));

  console.log("Failed Tasks:");
  console.table(failedTasks.map((t) => truncateTask(t)));

  console.log("Queued Tasks:");
  console.table(queuedTasks.map((t) => truncateTask(t)));

  console.log("Complete Tasks:");
  console.table(completeTasks.map((t) => truncateTask(t)));
}

function truncateTask(t: any): any {
  return {
    ...t,
    task_cmd: truncate(t.task_cmd),
    stderr: truncate(t.stderr),
    stdout: truncate(t.stdout),
  };
}

function truncate(str, n = 20, useWordBoundary = false) {
  if (str.length <= n) {
    return str;
  }
  const subString = str.substr(0, n - 1);
  return (useWordBoundary ? subString.substr(0, subString.lastIndexOf(" ")) : subString) + "…";
}
