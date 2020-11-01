var argv = require("minimist")(process.argv.slice(2));

const queueName = argv["queue"] ?? "default_queue";

export const config = {
  queueName,
  addTaskCmd: argv["_"],
  taskTableName: `${queueName}_tasks`,
  maxConcurrent: 6,
};
