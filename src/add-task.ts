import shelf from "node-persist";
import { config } from "./config";
import { Task } from "./types";
import sqlite from "better-sqlite3";

const defaultTaskObject = (taskCmd: string): Task => {
  return { taskCmd, status: "QUEUED" };
};

// disregard add task if the same command already exists in the queue (whether or not it exited successfully or not)
const atomic = process.env.ADD_TASK_STYLE === "ATOMIC";

export async function addTask(newTaskCmd?: Task): Promise<Task[]> {
  await shelf.init({ dir: config.queueName });

  const cart: Task[] = (await shelf.getItem("taskList")) ?? [];

  if (!newTaskCmd) return cart;

  const db = sqlite("foobar.db");

  const row = db.prepare(`SELECT * FROM ${} WHERE taskCmd = ${}`).pluck();
  console.log(row.firstName, row.lastName, row.email);

  const taskList =
    atomic && cart.find((known) => newTaskCmd.taskCmd === known.taskCmd)
      ? cart.map((known) => (newTaskCmd.taskCmd === known.taskCmd ? known : newTaskCmd))
      : [...cart, newTaskCmd];

  await shelf.setItem("taskList", taskList);

  return taskList;
}

if (require.main === module)
  (async () => {
    const cmd = defaultTaskObject(process.argv[2]);
    console.log(await addTask(cmd));
  })();
