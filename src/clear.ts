import { config } from "./config";
import { init } from "./storage";

if (require.main === module)
  (async () => {
    console.log(clearQueue());
  })();

export function clearQueue() {
  const db = init();

  const status = process.argv[3];
  const condStatus = status ? `where status = '${status}'` : "";

  db.prepare(`DELETE FROM ${config.taskTableName} ${condStatus}`).run();

  return `Cleared queue`;
}
