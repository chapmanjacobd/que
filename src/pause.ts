import { config } from "./config";
import sqlite from "better-sqlite3";
import { join } from "path";

if (require.main === module)
  (async () => {
    console.log(await togglePause(config.queueName));
  })();

export function togglePause(queueName: string) {
  const db = sqlite(join(__dirname, "..", "db.sqlite"));

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
