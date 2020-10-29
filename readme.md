Inspired by [taskspooler](http://freshmeat.net/projects/taskspooler/), and digdag.

## Tool objectives

- Control what to do with the input/output of thousands of processes
- Suspend all tasks
- Restart failed tasks

## Limits

- One queue system per user per system

## Interface

The default action `do` should append a job.

## Job execution

We should fork a '\$SHELL' and run the job command, because a user may expect his
shell parser.

## Job states

- queued
- running
- failed
- complete

## Input/output

The user, when adding a job to the queue, should be able to choose:

- Where the output goes. As flags:
  - store: put it into a file in /tmp (or similar).
  - mail: put it into a file in /tmp, and send it by mail (maybe gzipped)
  - gzip: directly gzip the output
  - tail: store in a buffer the last 10 lines
    A user may choose "mail || gzip", and the file should be mailed gzipped. Or
    "gzip || tail", and the file should be stored directly gzipped, although with
    tailing available.
- What to do with the input: opened/closed
  If opened, the user should be able to connect its current stdin to the
  process'.

## Job management

- Shutdown: stop all the background processes related to the queues.
- tail (id): 'tail' the last lines of a process' output.
- list: list the queues, with relevant information
- wait (id)\*: block until some processes dies
- remove (id)+: remove jobs from the queue
- clear: remove the information about dead jobs (errorlevels, etc.)
