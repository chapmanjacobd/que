import { schedule as cronSchedule } from "node-cron";
import { getText } from "./content";
import { mail } from "./email";
import { initializeBooks } from "./io";
import { Book } from "./types";
import { err, nextCron } from "./utils";

// User Config:
// 30 emailsPerMonth == 1 per day
//  4 emailsPerMonth == 1 per week

if (!module.parent)
  (async () => {
    await initializeBooks()
      .then(async (b) => await schedule(b, { minParagraphsPerEmail: 5, emailsPerMonth: 15 }))
      .catch(err);
  })();

interface ContentConfig {
  minParagraphsPerEmail?: number;
  emailsPerMonth?: number;
}

export async function schedule(bookList: Book[], opts: ContentConfig) {
  await emailAndScheduleNext();

  async function emailAndScheduleNext() {
    await mail(getText(bookList, opts.minParagraphsPerEmail));

    cronSchedule(nextCron(opts.emailsPerMonth), async () => await emailAndScheduleNext());
  }
}
