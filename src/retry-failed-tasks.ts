import shelf from "node-persist";
import { config } from "./config";
import { Task } from "./types";

export async function restartFailedTasks(appendCmd?: string): Promise<Task[]> {
  await shelf.init({ dir: config.queueName });

  const cart: Task[] = (await shelf.getItem("taskList")) ?? [];

  const taskList: Task[] = cart.map((existing) =>
    existing.status === "FAILED"
      ? { ...existing, status: "QUEUED", taskCmd: existing.taskCmd + appendCmd }
      : existing
  );

  await shelf.setItem("taskList", taskList);

  return taskList;
}

if (require.main === module)
  (async () => {
    console.log(await restartFailedTasks());
  })();
