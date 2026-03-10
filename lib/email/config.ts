/* lib/email/config.ts */

import nodemailer from "nodemailer";

export const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function verifyEmailConnection() {
  try {
    await emailTransporter.verify();
    console.log("SMTP server ready to send emails.");
    return true;
    
  } catch (error) {
    console.error("Error connecting to SMTP server:", error);
    return false;
  };
};