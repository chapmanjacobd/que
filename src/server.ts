#!/usr/bin/env node
import { exec } from "child_process";
import { addTask } from "./add-task";
import { Task } from "./types";
import { config } from "./config";
import { init } from "./storage";

if (require.main === module) runTasks();

export async function runTasks() {
  const db = init();
  console.log("Task server started");

  db.prepare(`UPDATE ${config.taskTableName} set status = 'QUEUED' WHERE status = 'RUNNING'`).run();

  // process.on("SIGTERM", () => {
  //   console.info("SIGTERM signal received. Shutting down after a minute.");
  //   refreshRate = 2147483640;
  //   setTimeout(() => {
  //     process.exit(0);
  //   }, 2 * 60000);
  // });

  let refreshRate = 800;
  await run();

  async function run() {
    while (true) {
      await new Promise((r) => setTimeout(r, refreshRate));

      const q = db.prepare(`SELECT * FROM queues WHERE q_name = '${config.queueName}'`).get();
      if (q.status == "RUNNING") {
        const taskList = addTask();

        // run n tasks until max concurrent is reached
        const nRunningTasks = taskList.filter((t) => t.status === "RUNNING").length;
        const nTasksToStart = config.maxConcurrent - nRunningTasks;

        if (nRunningTasks < config.maxConcurrent) {
          const tasksToStart = taskList
            .filter((t) => t.status === "QUEUED")
            .slice(0, nTasksToStart);

          for (const queuedTask of tasksToStart) {
            processTask(db, queuedTask);
          }
        }
      }
    }
  }
}

function processTask(db, queuedTask: Task) {
  db.prepare(
    `UPDATE ${config.taskTableName} set status = 'RUNNING' WHERE rowid = ${queuedTask.rowid}`
  ).run();

  exec(
    queuedTask.task_cmd,
    { shell: process.env.SHELL, cwd: queuedTask.wd, maxBuffer: 1024 * 2000 },
    (error, stdout, stderr) => {
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
    }
  );
}
