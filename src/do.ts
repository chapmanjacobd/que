#!/usr/bin/env node
/*

$ que
$ que touch file

- check if server.ts is running
- if not, spawn a process
- add task


$ que --queue=test touch file // specifying the queue explicitly will not automatically start the server
$ que pause
$ que retry
$ que clear
$ que show
$ que show --json
if serverNotRunning console.log('Server is not currently running. Run `que` to start the server.')

*/
