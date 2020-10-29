import shelf from "node-persist";
import { Task } from "./types";

export async function restartFailedTasks(): Promise<Task[]> {
  await shelf.init({ dir: "task-status" });

  const cart: Task[] = (await shelf.getItem("taskList")) ?? [];

  const taskList: Task[] = cart.map((task) =>
    task.status === "FAILED" ? { ...task, status: "QUEUED" } : task
  );

  await shelf.setItem("taskList", taskList);

  return taskList;
}

if (require.main === module)
  (async () => {
    console.log(await restartFailedTasks());
  })();
