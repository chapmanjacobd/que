import { config } from "./config";
import { init } from "./storage";

if (require.main === module)
  (async () => {
    console.log(await togglePause(config.queueName));
  })();

export function togglePause(queueName: string) {
  const db = init();

  const queue = db.prepare(`SELECT * FROM queues WHERE q_name = '${queueName}'`).get();

  switch (queue.status) {
    case "RUNNING":
      db.prepare(`UPDATE queues set status = 'PAUSED' WHERE q_name = '${queueName}'`).run();
      return "Queue paused";

    case "PAUSED":
      db.prepare(`UPDATE queues set status = 'RUNNING' WHERE q_name = '${queueName}'`).run();
      return "Queue resumed";

    default:
      console.error("Queue empty. Cannot pause.");
      break;
  }

  return queue;
}
