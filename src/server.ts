import { exec } from "child_process";
import { addTask } from "./add-task";
import { Task } from "./types";
import sqlite from "better-sqlite3";
import { join } from "path";
import { config } from "./config";
import { init } from "./storage";

if (require.main === module) runTasks();

export function runTasks() {
  const db = init();
  console.log("Task server started");

  run();

  function run() {
    const q = db.prepare(`SELECT * FROM queues WHERE q_name = '${config.queueName}'`).get();
    if (q.status == "RUNNING") {
      const taskList = addTask();

      // run n tasks until max concurrent is reached
      const MAX_CONCURRENT = 4;
      const nRunningTasks = taskList.filter((t) => t.status === "RUNNING").length;
      const nTasksToStart = MAX_CONCURRENT - nRunningTasks;

      if (nRunningTasks < MAX_CONCURRENT) {
        const tasksToStart = taskList.filter((t) => t.status === "QUEUED").slice(0, nTasksToStart);

        for (const queuedTask of tasksToStart) {
          processTask(queuedTask);
        }
      }
    }

    setTimeout(run, 80);
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
