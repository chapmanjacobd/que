import { exec } from "child_process";
import { addTask } from "./add-task";
import { Task } from "./types";
import { err } from "./utils";
import Database from "better-sqlite3";

const db = new Database("tasks.db", { verbose: console.log });

if (require.main === module)
  (async () => {
    await addTask()
      .then(async (tasks) => await runTasks(tasks))
      .catch(err);
  })();

export async function runTasks(taskList: Task[]) {
  await run();

  async function run() {
    // run tasks until max concurrent is reached
    // call yourself after running

    const MAX_CONCURRENT = 4;
    const nRunningTasks = taskList.filter((t) => t.status === "RUNNING").length;
    const nTasksToStart = MAX_CONCURRENT - nRunningTasks;

    if (nRunningTasks < MAX_CONCURRENT) {
      const tasksToStart = taskList.filter((t) => t.status === "QUEUED").slice(0, nTasksToStart);

      for (const queuedTask of tasksToStart) {
        processTask(queuedTask);
      }
    }

    await run();
  }
}

function processTask(queuedTask: Task) {
  queuedTask.status = "RUNNING";

  exec(queuedTask.taskCmd, { shell: process.env.SHELL }, (error, stdout, stderr) => {
    const exitCode = error.code;

    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);

    if (exitCode === 0) {
      queuedTask.status = "COMPLETE";
    } else {
      queuedTask.status = "FAILED";
      queuedTask.out = stdout;
      queuedTask.err = stderr;
      queuedTask.exit = exitCode;
    }
  });
}
