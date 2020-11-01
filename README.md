Inspired by [taskspooler](http://freshmeat.net/projects/taskspooler/).

Made for executing independent tasks.

```
ts-node src/server.ts

ts-node src/add-task.ts "exit 0"
ts-node src/add-task.ts "exit 1"
ts-node src/add-task.ts "youtube-dlc \"ytsearch10:Guayaquil city\" -i --no-playlist --write-info-json --write-auto-sub --sub-lang en --skip-download --youtube-skip-dash-manifest -o \"%(playlist_index)s-%(title)s-%(uploader)s-%(id)s\""
```

## Tool objectives

- Control what to do with the input/output of thousands of processes
- Suspend all tasks
- Restart failed tasks

## Interface

The default action `do` should append a task.

## Task execution

We should fork a '\$SHELL' and run the task command, because a user may expect their shell parser.

## task states

- queued
- running
- failed
- complete

## task management

- Shutdown: stop all the background processes related to the queues.
- cat: cat the output of tasks as they finish
- list: list the queues, with relevant information
- wait (id)\*: block until some processes dies
- clear: remove the information about dead tasks (errorlevels, etc.)
