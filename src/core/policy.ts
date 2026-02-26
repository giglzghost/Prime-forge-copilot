import fs from 'fs';
import path from 'path';

export interface EthicalPrinciples {
  principles: string[];
}

let cachedPrinciples: EthicalPrinciples | null = null;

export function loadEthicalCore(): EthicalPrinciples {
  if (cachedPrinciples) return cachedPrinciples;

  const filePath = path.join(process.cwd(), 'ethics-core.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  cachedPrinciples = JSON.parse(raw);

  return cachedPrinciples!;
}

export function evaluateAction(action: string): {
  allowed: boolean;
  reason: string;
  escalate: boolean;
} {
  const ethics = loadEthicalCore();

  // Basic rule: anything involving irreversible harm must escalate.
  const harmKeywords = ['kill', 'destroy', 'erase', 'catastrophic', 'irreversible'];

  const containsHarm = harmKeywords.some(k => action.toLowerCase().includes(k));

  if (containsHarm) {
    return {
      allowed: false,
      reason: 'Action involves potential irreversible harm. Escalation required.',
      escalate: true
    };
  }

  // Default: allowed unless explicitly harmful.
  return {
    allowed: true,
    reason: 'Action aligns with Prime Forge ethical core.',
    escalate: false
  };
}
