# que

depreciated: I recommend using GNU Parallel instead. It probably will meet your needs

Inspired by [taskspooler](http://freshmeat.net/projects/taskspooler/).

![que screenshot](https://i.imgur.com/S7xKMhj.png)

Made for executing independent tasks.

```fish
git clone https://github.com/chapmanjacobd/que
pnpm install
pnpm run start
abbr que /home/xk/jsprojects/que/dist/que.js

## start the que server (it will be in charge of spawning all the tasks)

que

## add some tasks

que exit 0
que touch hello_world
que exit 1

## show contents of the queue

que show
watch que show
que show json
que show json 24 <-- only show specific task based on rowid

## retry failed tasks

que retry
que retry 24 <-- only retry specific task

## delete everything

que clear

## flush a status of the queue (deletes all the tasks which have the status)

que clear COMPLETED
que clear RUNNING

## shutdown the server
que pause
que kill-task-server

## resume / un-pause the queue
que
que pause

que youtube-dlc "ytsearch10:Guayaquil city" -i --no-playlist --write-info-json --write-auto-sub --sub-lang en --skip-download --youtube-skip-dash-manifest -o "%(playlist_index)s-%(title)s-%(uploader)s-%(id)s"

```

## Tool objectives

- Control what to que with the input/output of thousands of processes
- Pause the queue in relaxed way (RUNNING tasks will finish but no new tasks will run)
- Restart failed tasks

## Interface

The default action `que` should append a task.

## Task execution

We spawn a '\$SHELL' and run the task command, because a user may expect their shell parser.

## Task states

- queued
- running
- failed
- complete
