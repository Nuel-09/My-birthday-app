import cron from "node-cron";
import { User } from "../models/user.model.js";
import { sendBirthdayEmail } from "./email.service.js";

/**
 * Schedules the daily birthday scan (default 7:00 AM via CRON_SCHEDULE in .env).
 */
export function scheduleBirthdayJob(jobFn, schedule) {
  cron.schedule(schedule, jobFn);
}

export async function processTodayBirthdays() {
  const now = new Date();
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();

  const celebrants = await User.find({
    $expr: {
      $and: [
        { $eq: [{ $month: "$dateOfBirth" }, month] },
        { $eq: [{ $dayOfMonth: "$dateOfBirth" }, day] },
      ],
    },
  }).lean();

  if (!celebrants.length) {
    console.log("[cron] No birthdays today.");
    return { total: 0, sent: 0 };
  }

  let sentCount = 0;
  for (const celebrant of celebrants) {
    try {
      const result = await sendBirthdayEmail({
        username: celebrant.username,
        email: celebrant.email,
      });
      if (result.sent) {
        sentCount += 1;
      }
    } catch (error) {
      console.error(`[cron] Failed to send email to ${celebrant.email}:`, error.message);
    }
  }

  console.log(`[cron] Birthday job complete. Total: ${celebrants.length}, Sent: ${sentCount}`);
  return { total: celebrants.length, sent: sentCount };
}
