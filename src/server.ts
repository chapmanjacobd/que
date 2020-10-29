import { spawn } from "child_process";
import { addTask } from "./add-task";
import { Task } from "./types";
import { err } from "./utils";

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

async function processTask(queuedTask: Task) {
  const finishedTask = await spawn(queuedTask.taskCmd, { shell: "" });

  queuedTask.out = finishedTask.stdout.read();
  queuedTask.err = finishedTask.stderr;
  queuedTask.exit = finishedTask.exitCode;

  if (finishedTask.exitCode === 0) {
    queuedTask.status = "COMPLETE";
  } else {
    queuedTask.status = "FAILED";
  }
}
