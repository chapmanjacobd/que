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

    await run();
  }
}
