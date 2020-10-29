import shelf from "node-persist";
import { Task } from "./types";

const defaultTaskObject = (taskCmd: string): Task => {
  return { taskCmd, status: "QUEUED" };
};

const atomic = process.env.ADD_TASK_STYLE === "ATOMIC";

export async function addTask(newTaskCmd?: Task): Promise<Task[]> {
  await shelf.init({ dir: "task-status" });

  const cart: Task[] | undefined = await shelf.getItem("taskList");

  if (!newTaskCmd) return cart;

  const taskList = [
    ...cart?.map((known) => (atomic && newTaskCmd.taskCmd === known.taskCmd ? newTaskCmd : known)),
    !atomic ? newTaskCmd : undefined,
  ];

  await shelf.setItem("taskList", taskList);

  return taskList;
}

if (require.main === module)
  (async () => {
    const cmd = defaultTaskObject(process.argv[2]);
    console.log(await addTask(cmd));
  })();
