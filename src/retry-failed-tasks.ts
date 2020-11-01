import { config } from "./config";
import sqlite from "better-sqlite3";
import { join } from "path";

if (require.main === module)
  (async () => {
    console.log(restartFailedTasks());
  })();

export function restartFailedTasks({
  appendCmd,
  queueName,
}: { appendCmd?: string; queueName?: string } = {}) {
  const taskTableName = `${queueName ?? config.queueName}_tasks`;

  const db = sqlite(join(__dirname, "..", "db.sqlite"));

  const N_failedTasks = db
    .prepare(`SELECT count(*) FROM ${taskTableName} WHERE status = 'FAILED'`)
    .pluck()
    .get();

  if (appendCmd)
    db.prepare(
      `UPDATE ${taskTableName} set task_cmd = concat(task_cmd,'${appendCmd}') WHERE status = 'FAILED'`
    ).run();

  db.prepare(`UPDATE ${taskTableName} set status = 'QUEUED' WHERE status = 'FAILED'`).run();

  return `Retrying ${N_failedTasks} ${N_failedTasks == 1 ? "task" : "tasks"}`;
}
