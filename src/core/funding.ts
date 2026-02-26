export interface Allocation {
  reinvest: number;
  paypalFees: number;
  investBucket: number;
  humanitarian: number;
  personal: number;
}

export function computeAllocation(monthlyDeposits: number): Allocation {
  const reinvest = monthlyDeposits * 0.51;
  const paypalFees = monthlyDeposits * 0.03;
  const remaining = monthlyDeposits - reinvest - paypalFees;

  const investBucket = remaining * 0.6;
  const humanitarian = remaining * 0.4;

  const personal = 0; // personal is enforced via “$1000 in account” rule, not direct %

  return { reinvest, paypalFees, investBucket, humanitarian, personal };
}

export function canStartHumanitarian(personalVerified: number): boolean {
  return personalVerified >= 1000;
}
