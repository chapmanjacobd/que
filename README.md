Inspired by [taskspooler](http://freshmeat.net/projects/taskspooler/), and digdag.

Made for executing independent tasks.

Using node-persist instead of sqlite because I made this while on a plane and npm install doesn't work so don't update tasks concurrently. Hmm yeah I think this isn't going to work well without sqlite :/

## Tool objectives

- Control what to do with the input/output of thousands of processes
- Suspend all tasks
- Restart failed tasks

## Limits

- One queue system per user per system

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
- tail (id): 'tail' the last lines of a process' output.
- list: list the queues, with relevant information
- wait (id)\*: block until some processes dies
- remove (id)+: remove tasks from the queue
- clear: remove the information about dead tasks (errorlevels, etc.)
