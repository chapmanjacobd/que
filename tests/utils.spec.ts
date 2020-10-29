import { emailDays } from "../src/utils";

describe("calculate tab", function () {
  it("crons", () => expect(emailDays(32).length).toBe(32));
});
