import nodemailer from "nodemailer";

const RECIPIENTS = [
  "theonlineyards@outlook.com",
  "fireniceinc@msn.com",
  "giglzghost@gmail.com"
];

const FROM_ADDRESS = process.env.PF_MAIL_FROM || "prime-forge@system.local";

function createTransport() {
  // Configure via env so it works on Vercel/Azure
  // e.g. SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT
    ? parseInt(process.env.SMTP_PORT, 10)
    : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    // Soft fail: log only, don’t crash
    console.warn("[notifier] SMTP not configured, email disabled.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
}

export async function requestAuthorizationEmail(
  subject: string,
  reason: string,
  details?: any
): Promise<void> {
  const transport = createTransport();
  if (!transport) return;

  const bodyLines = [
    `Prime Forge Copilot requires your authorization.`,
    ``,
    `Reason: ${reason}`,
    ``,
    `Details:`,
    JSON.stringify(details || {}, null, 2),
    ``,
    `Mode: (see system status endpoint)`,
    `Time: ${new Date().toISOString()}`
  ];

  await transport.sendMail({
    from: FROM_ADDRESS,
    to: RECIPIENTS.join(", "),
    subject: subject || "Prime Forge Copilot – Authorization Required",
    text: bodyLines.join("\n")
  });
}
