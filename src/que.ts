#!/usr/bin/env node

import { addTask } from "./add-task";
import { clearQueue } from "./clear";
import { spawnSync } from "child_process";
import { togglePause } from "./pause";
import { restartFailedTasks } from "./retry-failed-tasks";
import { showTasks } from "./show";

/*

-----------------------------------------------------------

$ que
$ que touch file

- check if server.ts is running
- if not, spawn a process
- add task

-----------------------------------------------------------

$ que --queue=test touch file // specifying the queue explicitly will not automatically start the server
$ que pause
$ que retry
$ que clear
$ que show
$ que show --json

- if serverNotRunning console.log('Server is not currently running. Run `que` to start the server.')

-----------------------------------------------------------

*/

const firstArg = process.argv[2];

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

  case "show":
    showTasks();
    break;

  default:
    spawnSync("ts-node ./server.ts");
    console.log("Que server started");
    if (firstArg) addTask();
    break;
}
