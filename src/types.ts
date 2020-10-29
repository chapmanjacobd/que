export type TaskStatus = "QUEUED" | "RUNNING" | "FAILED" | "COMPLETE";

export type QueueState = "PAUSED" | "RUNNING" | "DONE" | "EMPTY";

export type Task = {
  taskCmd: string;
  status: TaskStatus;
};

export type Queue = {
  state: QueueState;
};
