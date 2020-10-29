import { schedule as cronSchedule } from "node-cron";
import { Task } from "./types";
import { err, nextCron } from "./utils";

// User Config:
// 30 emailsPerMonth == 1 per day
//  4 emailsPerMonth == 1 per week

if (require.main === module)
  (async () => {
    await initializeTasks()
      .then(async (b) => await schedule(b, { minParagraphsPerEmail: 5, emailsPerMonth: 15 }))
      .catch(err);
  })();

interface ContentConfig {
  minParagraphsPerEmail?: number;
  emailsPerMonth?: number;
}

export async function schedule(taskList: Task[], opts: ContentConfig) {
  await emailAndScheduleNext();

  async function emailAndScheduleNext() {
    await mail(getText(taskList, opts.minParagraphsPerEmail));

    cronSchedule(nextCron(opts.emailsPerMonth), async () => await emailAndScheduleNext());
  }
}
