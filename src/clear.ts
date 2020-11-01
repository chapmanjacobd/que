import { config } from "./config";
import { init } from "./storage";

if (require.main === module)
  (async () => {
    console.log(clearQueue());
  })();

export function clearQueue(queueName?: string) {
  const db = init();

  db.prepare(`DELETE FROM ${config.taskTableName}`).run();

  return `Cleared queue`;
}
