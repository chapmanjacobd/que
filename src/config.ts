var argv = require("minimist")(process.argv.slice(2));

const queueName = argv["queue"] ?? "default";

export const config = {
  queueName,
  addTaskCmd: argv["_"].join(" "),
  taskTableName: `${queueName}_tasks`,
  maxConcurrent: 6,
};
