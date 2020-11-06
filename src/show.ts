import { config } from "./config";
import { init } from "./storage";

if (require.main === module)
  (async () => {
    showTasks();
  })();

export function showTasks() {
  const db = init();

  const rowid = process.argv[4];
  const condRowId = rowid ? "and rowid = " + rowid : "";

  const runningTasks = db
    .prepare(`SELECT rowid, * FROM ${config.taskTableName} WHERE status = 'RUNNING' ${condRowId}`)
    .all();
  const failedTasks = db
    .prepare(`SELECT rowid, * FROM ${config.taskTableName} WHERE status = 'FAILED' ${condRowId}`)
    .all();
  const queuedTasks = db
    .prepare(`SELECT rowid, * FROM ${config.taskTableName} WHERE status = 'QUEUED' ${condRowId}`)
    .all();
  const completeTasks = db
    .prepare(`SELECT rowid, * FROM ${config.taskTableName} WHERE status = 'COMPLETE' ${condRowId}`)
    .all();

  if (process.argv.includes("json"))
    return console.log({ queuedTasks, runningTasks, failedTasks, completeTasks });

  console.log("Queued Tasks:", queuedTasks.length);

  console.log("Running Tasks:");
  console.table(runningTasks.map((t) => truncateTask(t)));

  console.log("Failed Tasks:");
  console.table(failedTasks.map((t) => truncateTask(t)));

  console.log("Complete Tasks:");
  console.table(completeTasks.map((t) => truncateTask(t)));
}

function truncateTask(t: any): any {
  return {
    rowid: t.rowid,
    task_cmd: truncate(t.task_cmd),
    exit_code: t.exit_code,
    stderr: t.stderr?.split("\n").length,
    stdout: t.stdout?.split("\n").length,
  };
}

function truncate(str: string, n = 120, align = "MIDDLE") {
  if (!str) return str;
  if (str.length <= n) {
    return str;
  }
  const middleN = Math.floor(n / 2);

  switch (align) {
    case "MIDDLE":
      return str.substr(0, middleN - 1) + "…" + str.substr(1 - middleN);

    case "LEFT":
      return str.substr(0, n - 1) + "…";

    default:
      return "…" + str.substr(1 - n);
  }
}
