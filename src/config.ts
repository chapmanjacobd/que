export const config = { queueName: process.argv[3] ?? "default_queue" };

if (process.argv[4])
  throw `More than 3 arguments found. You probably need to wrap your task command in quotes: $ do "touch filename" queue_name`;
