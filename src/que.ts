#!/usr/bin/env node

import { addTask } from "./add-task";
import { clearQueue } from "./clear";
import { spawn, execSync } from "child_process";
import { togglePause } from "./pause";
import { restartFailedTasks } from "./retry-failed-tasks";
import { showTasks } from "./show";
import psList from "ps-list";
import { config } from "./config";
import path from "path";
import fs from "fs";

/*
-----------------------------------------------------------

$ que
$ que touch file

- check if server.ts is running
- if not, spawn a process
- add task

-----------------------------------------------------------

$ que pause
$ que retry
$ que clear
$ que show
$ que show json

-----------------------------------------------------------
*/

(async () => {
  // get args from minimist so we can not worry about `--queue`
  const firstArg = config.addTaskCmd.split(" ")[0];
  console.log(`Using ${config.queueName} queue`);

  switch (firstArg) {
    case "pause":
      togglePause();
      break;

    case "retry":
      restartFailedTasks();
      break;

    case "clear":
      clearQueue();
      break;

    case "empty":
      clearQueue();
      break;

    case "show":
      showTasks();
      break;

    case "kill-task-server":
      killTaskServer(await serverRunning());
      break;

    default:
      if (!(await serverRunning())) startTaskServer();
      console.log("Que server started");
      if (firstArg) addTask();
      return;
  }

  if (!(await serverRunning()))
    console.log("Que server is not running. Run `que` or add a task to start the server.");
})();

async function serverRunning(): Promise<number> {
  const processes = await psList();
  const [server] = processes.filter(
    (x) => x.name === "node" && x.cmd.includes("que/src/server.ts")
  );

  return server?.pid;
}

function killTaskServer(pid: number) {
  execSync(`kill ${pid}`);
  console.log("Que will sleep the great sleep (in a minute)");
}

function startTaskServer() {
  const server = spawn(`ts-node ${__dirname}/server.ts`, {
    detached: true,
    shell: process.env.SHELL,
    stdio: ["ignore" /* stdin */, "ignore" /* stdout */, "ignore" /* stderr */],
  });

  server.unref();
}
