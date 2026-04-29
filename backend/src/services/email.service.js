import nodemailer from "nodemailer";

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

function isEmailConfigured() {
  return (
    process.env.EMAIL_HOST &&
    process.env.EMAIL_PORT &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS &&
    process.env.EMAIL_FROM
  );
}

function birthdayHtml(username) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #6d28d9; margin-bottom: 8px;">Happy Birthday, ${username}! 🎉</h2>
      <p style="font-size: 16px; line-height: 1.6; color: #1f2937;">
        Wishing you joy, good health, and wonderful moments all year round.
      </p>
      <p style="font-size: 16px; line-height: 1.6; color: #1f2937;">
        Have an amazing celebration!
      </p>
      <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">
        Sent by Birthday Reminder App
      </p>
    </div>
  `;
}

export async function sendBirthdayEmail({ username, email }) {
  if (!isEmailConfigured()) {
    console.warn("Email settings are incomplete. Skipping birthday email send.");
    return { sent: false, reason: "missing_email_config" };
  }

  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Happy Birthday, ${username}!`,
    html: birthdayHtml(username),
  });

  return { sent: true };
}
