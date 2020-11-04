var argv = require("minimist")(process.argv.slice(2));

const queueName = argv["queue"] ?? process.env.QUEUE_NAME ?? "default";

export const config = {
  queueName,
  addTaskCmd: process.argv.slice(2),
  taskTableName: `${queueName}_tasks`,
  maxConcurrent: Number(process.env.MAX_CONCURRENT ?? 4),
};
