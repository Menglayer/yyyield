import type { RiskLevel } from "./types";

// ===== Number formatting =====

export function formatUsd(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

export function formatApy(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return "-";
  return `${n.toFixed(2)}%`;
}

export function formatPercent(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return "-";
  return `${(n * 100).toFixed(2)}%`;
}

// ===== Risk coloring =====

const RISK_COLORS: Record<RiskLevel, string> = {
  "A+": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  A: "text-green-400 bg-green-400/10 border-green-400/20",
  "B+": "text-lime-400 bg-lime-400/10 border-lime-400/20",
  B: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  "C+": "text-amber-400 bg-amber-400/10 border-amber-400/20",
  C: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  D: "text-red-400 bg-red-400/10 border-red-400/20",
  unknown: "text-gray-400 bg-gray-400/10 border-gray-400/20",
};

export function getRiskColor(risk: RiskLevel): string {
  return RISK_COLORS[risk] ?? RISK_COLORS.unknown;
}

// ===== Chain colors & labels =====

const CHAIN_STYLES: Record<string, { color: string; label: string }> = {
  Ethereum: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "以太坊" },
  Arbitrum: { color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30", label: "Arbitrum" },
  Base: { color: "bg-sky-500/20 text-sky-400 border-sky-500/30", label: "Base" },
  Optimism: { color: "bg-red-500/20 text-red-400 border-red-500/30", label: "Optimism" },
  Polygon: { color: "bg-purple-500/20 text-purple-400 border-purple-500/30", label: "Polygon" },
  Solana: { color: "bg-violet-500/20 text-violet-400 border-violet-500/30", label: "Solana" },
  Avalanche: { color: "bg-rose-500/20 text-rose-400 border-rose-500/30", label: "Avalanche" },
  BSC: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", label: "BSC" },
  HyperEVM: { color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30", label: "HyperEVM" },
  Katana: { color: "bg-pink-500/20 text-pink-400 border-pink-500/30", label: "Katana" },
  Monad: { color: "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30", label: "Monad" },
  "World Chain": { color: "bg-teal-500/20 text-teal-400 border-teal-500/30", label: "World Chain" },
};

const DEFAULT_CHAIN_STYLE = {
  color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  label: "",
};

export function getChainColor(chain: string): string {
  return (CHAIN_STYLES[chain] ?? DEFAULT_CHAIN_STYLE).color;
}

export function getChainLabel(chain: string): string {
  return (CHAIN_STYLES[chain]?.label) ?? chain;
}

// ===== Protocol labels =====

const PROTOCOL_LABELS: Record<string, string> = {
  "aave-v3": "Aave V3",
  aave_v3: "Aave V3",
  "aave-v2": "Aave V2",
  "morpho-blue": "Morpho Blue",
  morpho: "Morpho",
  "compound-v3": "Compound V3",
  "compound-v2": "Compound V2",
  lido: "Lido",
  "rocket-pool": "Rocket Pool",
  "spark-lending": "Spark",
  "maker-dsr": "Maker DSR",
  convex: "Convex",
  curve: "Curve",
  yearn: "Yearn",
  pendle: "Pendle",
  "ethena-usde": "Ethena",
  "fluid-lending": "Fluid",
  "sky-lending": "Sky",
};

export function getProtocolLabel(slug: string): string {
  return PROTOCOL_LABELS[slug] ?? slug;
}

// ===== APY change coloring =====

export function getApyChangeColor(pct: number | null | undefined): string {
  if (pct == null) return "text-[var(--text-muted)]";
  if (pct > 0) return "text-emerald-400";
  if (pct < 0) return "text-red-400";
  return "text-[var(--text-secondary)]";
}

// ===== Yieldz helpers =====

/** Convert lltv bps string (e.g. "8050") to ratio (0.805) */
export function lltvBpsToRatio(lltv: string): number {
  const n = Number(lltv);
  if (isNaN(n) || n <= 0) return 0;
  return n / 10000;
}

/** Effective leverage APY = (supplyApy - borrowApy * ltv) / (1 - ltv) */
export function computeEffectiveLeverageApy(
  supplyApy: number,
  borrowApy: number,
  ltvRatio: number,
): number {
  if (ltvRatio >= 1 || ltvRatio <= 0) return supplyApy;
  return (supplyApy - borrowApy * ltvRatio) / (1 - ltvRatio);
}

/** Max leverage = 1 / (1 - ltv) */
export function computeMaxLeverage(ltvRatio: number): number {
  if (ltvRatio >= 1 || ltvRatio <= 0) return 1;
  return 1 / (1 - ltvRatio);
}

// ===== Highlighted chains =====

export const HIGHLIGHTED_CHAINS = [
  "Ethereum",
  "Arbitrum",
  "Base",
  "Optimism",
  "HyperEVM",
  "Monad",
  "Polygon",
  "Solana",
  "Avalanche",
  "BSC",
  "Katana",
  "World Chain",
];

export function getTokenIconUrl(chainId: number, address: string, symbol: string): string {
  return `https://assets.smold.app/api/token/${chainId}/${address}/logo.svg`;
}
