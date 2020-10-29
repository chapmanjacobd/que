import { createTransport } from "nodemailer";
import { env } from "./env";
import { err } from "./utils";

if (!module.parent)
  (async () => {
    await mail({ title: "test", body: "this is a test LMAO" }).catch(err);
  })();

export async function mail({ body, title }) {
  let transporter = createTransport({
    port: 25,
    host: "localhost",
    tls: {
      rejectUnauthorized: false,
    },
  });

  let message = {
    from: env.from,
    to: env.to,
    subject: title,
    text: body,
  };

  let info = await transporter.sendMail(message);
  console.log(title, "sent successfully as %s", info.messageId);
}
