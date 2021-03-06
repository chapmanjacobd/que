import { config } from "./config";
import { Task } from "./types";
import { init } from "./storage";

if (require.main === module)
  (async () => {
    console.log(addTask());
  })();

export function addTask(): Task[] {
  const db = init();

  if (config.addTaskCmd && config.addTaskCmd !== "") {
    console.log("Adding task:", config.addTaskCmd);

    db.prepare(
      `INSERT INTO ${config.taskTableName} (task_cmd, status, wd) VALUES (@task_cmd, @status, @wd)`
    ).run({
      task_cmd: config.addTaskCmd,
      status: "QUEUED",
      wd: process.cwd(),
    });
  }

  return db
    .prepare(`SELECT rowid, * FROM ${config.taskTableName} WHERE status != 'FINISHED'`)
    .all();
}
