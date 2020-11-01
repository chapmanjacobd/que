import { config } from "./config";
import sqlite from "better-sqlite3";
import { join } from "path";

if (require.main === module)
  (async () => {
    console.log(clearQueue());
  })();

export function clearQueue(queueName?: string) {
  const taskTableName = `${queueName ?? config.queueName}_tasks`;

  const db = sqlite(join(__dirname, "..", "db.sqlite"));

  db.prepare(`DELETE FROM ${taskTableName}`).run();

  return `Cleared queue`;
}
