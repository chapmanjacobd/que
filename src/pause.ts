import shelf from "node-persist";
import { config } from "./config";
import { Queue } from "./types";

export async function togglePause() {
  await shelf.init({ dir: config.queueName });

  const cart: Queue = (await shelf.getItem("queue-status")) ?? [];

  switch (cart.state) {
    case "RUNNING":
      await shelf.setItem("queue-status", { state: "PAUSED" });
      console.log("Queue paused");
      break;

    case "PAUSED":
      await shelf.setItem("queue-status", { state: "RESUMED" });
      console.log("Queue resumed");
      break;

    default:
      console.error("Queue empty. Cannot pause.");
      break;
  }

  return cart;
}

if (require.main === module)
  (async () => {
    console.log(await togglePause());
  })();
