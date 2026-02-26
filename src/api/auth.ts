import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const IDENTITY_PATH = path.join(process.cwd(), "src", "data", "identity-core.json");

// Load or initialize identity core
function loadIdentityCore() {
  try {
    const raw = fs.readFileSync(IDENTITY_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return {
      rootHash: null,
      pendingChallenge: null,
      authorizedDomains: {},
      autonomy: {
        global: "A",
        financial: "A",
        business: "A",
        ai_creation: "A"
      }
    };
  }
}

function saveIdentityCore(data: any) {
  fs.mkdirSync(path.dirname(IDENTITY_PATH), { recursive: true });
  fs.writeFileSync(IDENTITY_PATH, JSON.stringify(data, null, 2), "utf8");
}

function hashPhrase(phrase: string): string {
  const h = crypto.createHash("sha256");
  h.update(phrase);
  return `sha256:${h.digest("hex")}`;
}

function createChallengeToken(): string {
  return crypto.randomBytes(24).toString("hex");
}

async function sendChallengeEmail(token: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.example.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || "user@example.com",
      pass: process.env.SMTP_PASS || "password"
    }
  });

  const linkBase = process.env.PF_AUTH_LINK_BASE || "https://your-domain.com/auth";
  const link = `${linkBase}?token=${encodeURIComponent(token)}`;

  const recipients = [
    "giglzghost@gmail.com",
    "fireniceinc@msn.com",
    "theonlineyards@outlook.com"
  ];

  const mailOptions = {
    from: process.env.SMTP_FROM || "primeforge-auth@example.com",
    to: recipients.join(","),
    subject: "Prime Forge – Authorization Challenge",
    text: `A request was made to authorize Prime Forge.\n\nChallenge token: ${token}\n\nYou can complete authorization at:\n${link}\n\nIf this was not you, ignore this email.`
  };

  await transporter.sendMail(mailOptions);
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Use POST." });
  }

  const body = req.body || {};
  const action = body.action;

  if (action === "request") {
    const identity = loadIdentityCore();
    const token = createChallengeToken();

    identity.pendingChallenge = {
      token,
      createdAt: Date.now()
    };

    saveIdentityCore(identity);

    try {
      await sendChallengeEmail(token);
    } catch (err: any) {
      console.error("AUTH EMAIL ERROR:", err);
      return res.status(500).json({
        ok: false,
        message: "Failed to send challenge email."
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Challenge email sent."
    });
  }

  if (action === "confirm") {
    const { token, rootPhrase, domains, keys } = body;

    if (!token || !rootPhrase) {
      return res.status(400).json({
        ok: false,
        message: "Missing 'token' or 'rootPhrase'."
      });
    }

    const identity = loadIdentityCore();

    if (
      !identity.pendingChallenge ||
      identity.pendingChallenge.token !== token
    ) {
      return res.status(400).json({
        ok: false,
        message: "Invalid or expired challenge token."
      });
    }

    const maxAgeMs = 15 * 60 * 1000;
    if (Date.now() - identity.pendingChallenge.createdAt > maxAgeMs) {
      identity.pendingChallenge = null;
      saveIdentityCore(identity);
      return res.status(400).json({
        ok: false,
        message: "Challenge token expired."
      });
    }

    identity.rootHash = hashPhrase(rootPhrase);
    identity.pendingChallenge = null;

    if (domains && typeof domains === "object") {
      identity.autonomy = {
        ...identity.autonomy,
        ...domains
      };
    }

    if (keys && typeof keys === "object") {
      identity.authorizedDomains = {
        ...identity.authorizedDomains,
        keysProvided: true
      };
    }

    saveIdentityCore(identity);

    return res.status(200).json({
      ok: true,
      message: "Authorization confirmed and root identity set.",
      autonomy: identity.autonomy
    });
  }

  return res.status(400).json({
    ok: false,
    message: "Unknown 'action'. Use 'request' or 'confirm'."
  });
}
