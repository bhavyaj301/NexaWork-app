export function formatSalary(amount: number, currency: string = '$'): string {
  if (amount >= 1000) {
    return `${currency}${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`;
  }
  return `${currency}${amount.toLocaleString()}`;
}

export function formatFullSalary(amount: number, currency: string = '$'): string {
  return `${currency}${amount.toLocaleString()}`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}k`;
  }
  return num.toLocaleString();
}

export function getMomentumColor(momentum: string): string {
  switch (momentum) {
    case 'Hyper-Growth':
      return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
    case 'Strong Growth':
      return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
    case 'Stable':
      return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
    case 'Cooling':
      return 'text-rose-500 bg-rose-500/10 border-rose-500/30';
    default:
      return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
  }
}

export function getDifficultyBadge(diff: string): string {
  switch (diff) {
    case 'Easy':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'Moderate':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'Challenging':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'Advanced':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
}
