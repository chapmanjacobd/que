import { config } from "./config";
import { Task } from "./types";
import { init } from "./storage";

if (require.main === module)
  (async () => {
    console.log(addTask(config.addTaskCmd));
  })();

export function addTask(newTaskCmd?: string): Task[] {
  const db = init();

  if (newTaskCmd)
    db.prepare(
      `INSERT INTO ${config.taskTableName} (task_cmd, status) VALUES (@task_cmd, @status)`
    ).run({
      task_cmd: newTaskCmd,
      status: "QUEUED",
    });

  return db
    .prepare(`SELECT rowid, * FROM ${config.taskTableName} WHERE status != 'FINISHED'`)
    .all();
}
