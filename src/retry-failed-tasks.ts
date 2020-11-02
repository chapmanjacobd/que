import { config } from "./config";
import { init } from "./storage";

if (require.main === module)
  (async () => {
    console.log(restartFailedTasks());
  })();

export function restartFailedTasks(appendCmd?: string) {
  const db = init();

  const N_failedTasks = db
    .prepare(`SELECT count(*) FROM ${config.taskTableName} WHERE status = 'FAILED'`)
    .pluck()
    .get();

  if (appendCmd)
    db.prepare(
      `UPDATE ${config.taskTableName} set task_cmd = concat(task_cmd,'${appendCmd}') WHERE status = 'FAILED'`
    ).run();

  db.prepare(`UPDATE ${config.taskTableName} set status = 'QUEUED' WHERE status = 'FAILED'`).run();

  return `Retrying ${N_failedTasks} ${N_failedTasks == 1 ? "task" : "tasks"}`;
}
