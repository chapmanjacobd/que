import { exec } from "child_process";
import { addTask } from "./add-task";
import { Task } from "./types";
import { config } from "./config";
import { init } from "./storage";

if (require.main === module) runTasks();

export function runTasks() {
  const db = init();
  console.log("Task server started");

  process.on("SIGTERM", () => {
    console.info("SIGTERM signal received. Shutting down after a minute.");
    refreshRate = 2147483640;
    setTimeout(() => {
      process.exit(0);
    }, 2 * 60000);
  });

  let refreshRate = 800;
  run();

  function run() {
    const q = db.prepare(`SELECT * FROM queues WHERE q_name = '${config.queueName}'`).get();
    if (q.status == "RUNNING") {
      const taskList = addTask();

      // run n tasks until max concurrent is reached
      const nRunningTasks = taskList.filter((t) => t.status === "RUNNING").length;
      const nTasksToStart = config.maxConcurrent - nRunningTasks;

      if (nRunningTasks < config.maxConcurrent) {
        const tasksToStart = taskList.filter((t) => t.status === "QUEUED").slice(0, nTasksToStart);

        for (const queuedTask of tasksToStart) {
          processTask(queuedTask);
        }
      }
    }

    // might want to look into this:
    // https://www.sqlite.org/c3ref/update_hook.html
    setTimeout(run, refreshRate);
  }
}

function processTask(queuedTask: Task) {
  const db = init();

  db.prepare(
    `UPDATE ${config.taskTableName} set status = 'RUNNING' WHERE rowid = ${queuedTask.rowid}`
  ).run();

  exec(queuedTask.task_cmd, { shell: process.env.SHELL }, (error, stdout, stderr) => {
    console.log(`Task ${error ? "completed" : "failed"}: `, queuedTask.task_cmd);
    console.group();
    console.log(stderr);
    if (process.env.VERBOSE) console.log(stdout);
    console.groupEnd();

    const exit_code = error ? error.code : 0;

    db.prepare(
      `UPDATE ${config.taskTableName} set
        stdout = @stdout,
        stderr = @stderr,
        exit_code = @exit_code,
        status = @status
      WHERE rowid = ${queuedTask.rowid}`
    ).run({
      stdout,
      stderr,
      exit_code,
      status: exit_code === 0 ? "COMPLETE" : "FAILED",
    });
  });
}
