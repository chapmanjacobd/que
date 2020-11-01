export type TaskStatus = "QUEUED" | "RUNNING" | "FAILED" | "COMPLETE";

export type QueueState = "PAUSED" | "RUNNING" | "DONE" | "EMPTY";

export type Task = {
  task_cmd: string;
  status: TaskStatus;
  rowid: number;
  exit_code: number;
  stdout: string;
  stderr: string;
};

export type Queue = {
  rowid: number;
  q_name: string;
  state: QueueState;
};
