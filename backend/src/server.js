import "dotenv/config";
import cors from "cors";
import express from "express";
import { connectDatabase } from "./config/database.js";
import userRoutes from "./routes/user.routes.js";
import {
  processTodayBirthdays,
  scheduleBirthdayJob,
} from "./services/birthday-cron.service.js";

const app = express();
const PORT = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI;
const cronSchedule = process.env.CRON_SCHEDULE || "0 7 * * *";

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/jobs/birthday/run-now", async (_req, res) => {
  try {
    const result = await processTodayBirthdays();
    return res.json({ message: "Birthday job executed.", result });
  } catch (_error) {
    return res.status(500).json({ message: "Birthday job failed." });
  }
});

async function main() {
  if (!mongoUri) {
    console.error("Missing MONGODB_URI in environment.");
    process.exit(1);
  }
  await connectDatabase(mongoUri);
  console.log("MongoDB connected.");

  scheduleBirthdayJob(async () => {
    try {
      await processTodayBirthdays();
    } catch (error) {
      console.error("[cron] Birthday job crashed:", error.message);
    }
  }, cronSchedule);

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
