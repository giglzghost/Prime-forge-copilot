import { requestAuthorizationEmail } from "../utils/notifier";

export async function requestCredentials(reason: string, details?: any) {
  await requestAuthorizationEmail(
    "Prime Forge Copilot – Credentials/Keys Needed",
    reason,
    details
  );
}
