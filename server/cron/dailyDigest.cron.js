import cron from "node-cron";
import User from "../models/user.js";
import { generateUserDigest } from "../services/digestService.js";
import { sendDigestEmail } from "../services/emailService.js";

cron.schedule("0 8 * * *", async () => {
  console.log("📧 Sending daily digests...");

  const users = await User.find();

  for (const user of users) {
    const html = await generateUserDigest(user);
    if (!html) continue;

    await sendDigestEmail(
      user.email,
      "🗞️ Your Daily Personalized News Digest",
      html
    );
  }

  console.log("✅ Daily digest emails sent");
});
