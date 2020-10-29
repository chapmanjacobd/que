import shelf from "node-persist";
import { Queue } from "./types";

export async function togglePause() {
  await shelf.init({ dir: "task-status" });

  const cart: Queue = (await shelf.getItem("default-queue")) ?? [];

  switch (cart.state) {
    case "RUNNING":
      await shelf.setItem("default-queue", { state: "PAUSED" });
      console.log("Queue paused");
      break;

    case "PAUSED":
      await shelf.setItem("default-queue", { state: "RESUMED" });
      console.log("Queue resumed");
      break;

    default:
      console.log("Cannot pause queue. Queue empty");
      break;
  }

  return cart;
}

if (require.main === module)
  (async () => {
    console.log(await togglePause());
  })();
