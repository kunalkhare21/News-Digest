import nodemailer from "nodemailer";

export async function sendDigestEmail(to, subject, html) {
  // 🔍 Debug (keep for now)
  console.log("EMAIL_USER =", process.env.EMAIL_USER);
  console.log("EMAIL_PASS exists =", !!process.env.EMAIL_PASS);

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email credentials not loaded");
  }

  // ✅ Create transporter AFTER env is loaded
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"News Digest" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log(`📧 Email sent to ${to}`);
}
