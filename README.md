# do

Inspired by [taskspooler](http://freshmeat.net/projects/taskspooler/).

Made for executing independent tasks.

```
ts-node src/server.ts

ts-node src/add-task.ts "exit 0"
ts-node src/add-task.ts "exit 1"
ts-node src/add-task.ts "youtube-dlc \"ytsearch10:Guayaquil city\" -i --no-playlist --write-info-json --write-auto-sub --sub-lang en --skip-download --youtube-skip-dash-manifest -o \"%(playlist_index)s-%(title)s-%(uploader)s-%(id)s\""

ts-node src/show.ts
ts-node src/show.ts --json

ts-node src/retry-failed-tasks.ts

ts-node src/clear.ts

To shutdown the server:
ts-node src/pause.ts
(then kill the server process: go to the terminal where the server was running and ctrl-c)

To resume (to un-pause the queue):
Start the server again
ts-node src/pause.ts
```

## Tool objectives

- Control what to do with the input/output of thousands of processes
- Pause the queue in relaxed way (RUNNING tasks will finish but no new tasks will run)
- Restart failed tasks

## Interface

The default action `do` should append a task.

## Task execution

We spawn a '\$SHELL' and run the task command, because a user may expect their shell parser.

## Task states

- queued
- running
- failed
- complete

## task management

- cat: cat the output of tasks as they finish
- list: list the queues, with relevant information
- wait (id)\*: block until some processes dies
- clear: deletes all tasks from the queue
