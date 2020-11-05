var minimist = require("minimist")(process.argv.slice(2));

var argv = process.argv
  .slice(2)
  .map(function (arg) {
    return arg.replace(/'/g, `"`);
  })
  .join(" ");

const queueName = minimist["queue"] ?? process.env.QUEUE_NAME ?? "default";

export const config = {
  queueName,
  addTaskCmd: argv,
  taskTableName: `${queueName}_tasks`,
  maxConcurrent: Number(process.env.MAX_CONCURRENT ?? 4),
};
