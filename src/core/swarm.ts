import fs from "fs";
import path from "path";

export interface SwarmAppearance {
  description: string;
  style: string;
}

export interface SwarmAgent {
  id: string;
  code: string;
  name: string;
  role: string;
  domain: string;
  status: string;
}

export interface SwarmCore {
  id: string;
  code: string;
  name: string;
  role: string;
  appearance: {
    public: SwarmAppearance;
    dashboard: SwarmAppearance;
  };
}

export interface SwarmPrimaryInterface {
  id: string;
  aliases: string[];
  name: string;
  role: string;
  appearance: {
    public: SwarmAppearance;
    dashboard: SwarmAppearance;
  };
}

export interface FinancialAllocationRules {
  reinvest_percent: number;
  paypal_fees_percent: number;
  remaining_percent: number;
  remaining_split: {
    invest_percent: number;
    humanitarian_percent: number;
  };
  humanitarian_unlock_condition: {
    type: string;
    amount_usd: number;
    description: string;
  };
}

export interface SwarmFinancialModel {
  source_label: string;
  example_monthly_deposits: number;
  allocation_rules: FinancialAllocationRules;
  notes: string[];
}

export interface SwarmEntities {
  company: {
    name: string;
    owner: string;
    ownership_percent: number;
    reinvestment_target_percent: number;
  };
  wallets: {
    paypal: { label: string; notes: string };
    crypto: { label: string; notes: string };
  };
}

export interface SwarmConfig {
  core: SwarmCore;
  primary_interface: SwarmPrimaryInterface;
  financial_model: SwarmFinancialModel;
  entities: SwarmEntities;
  agents: SwarmAgent[];
}

let cachedSwarm: SwarmConfig | null = null;

function loadSwarmConfig(): SwarmConfig {
  if (cachedSwarm) return cachedSwarm;

  const swarmPath = path.resolve(__dirname, "..", "data", "swarm.json");
  const raw = fs.readFileSync(swarmPath, "utf8");
  cachedSwarm = JSON.parse(raw);
  return cachedSwarm!;
}

export function getSwarm(): SwarmConfig {
  return loadSwarmConfig();
}

export function getCore(): SwarmCore {
  return loadSwarmConfig().core;
}

export function getPrimaryInterface(): SwarmPrimaryInterface {
  return loadSwarmConfig().primary_interface;
}

export function getAgents(): SwarmAgent[] {
  return loadSwarmConfig().agents;
}

export function findAgentById(id: string): SwarmAgent | undefined {
  return loadSwarmConfig().agents.find((a) => a.id === id || a.code === id);
}

export function getFinancialModel(): SwarmFinancialModel {
  return loadSwarmConfig().financial_model;
}

export function computeAllocationFromSwarm(monthlyDeposits: number) {
  const fm = getFinancialModel();
  const rules = fm.allocation_rules;

  const reinvest = (monthlyDeposits * rules.reinvest_percent) / 100;
  const paypalFees = (monthlyDeposits * rules.paypal_fees_percent) / 100;
  const remaining = (monthlyDeposits * rules.remaining_percent) / 100;

  const invest =
    (remaining * rules.remaining_split.invest_percent) / 100;
  const humanitarian =
    (remaining * rules.remaining_split.humanitarian_percent) / 100;

  return {
    reinvest,
    paypalFees,
    invest,
    humanitarian,
    remaining
  };
}

export function humanitarianUnlocked(personalVerifiedUsd: number): boolean {
  const fm = getFinancialModel();
  const cond = fm.allocation_rules.humanitarian_unlock_condition;
  if (cond.type === "personal_balance_threshold") {
    return personalVerifiedUsd >= cond.amount_usd;
  }
  return false;
}
