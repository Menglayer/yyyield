// ===== DefiLlama Pool Data =====

export interface YieldPool {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
  apyBase: number | null;
  apyReward: number | null;
  apyPct1D: number | null;
  apyPct7D: number | null;
  apyPct30D: number | null;
  apyMean30d: number | null;
  stablecoin: boolean;
  ilRisk: string;
  exposure: string;
  rewardTokens: string[] | null;
  underlyingTokens: string[] | null;
  poolMeta: string | null;
  mu: number;
  sigma: number;
  count: number;
  outlier: boolean;
  predictions: {
    predictedClass: string | null;
    predictedProbability: number | null;
    binnedConfidence: number | null;
  } | null;
  // Morpho-specific optional fields
  apyBaseBorrow?: number | null;
  apyRewardBorrow?: number | null;
  totalSupplyUsd?: number;
  totalBorrowUsd?: number;
  ltv?: number;
}

export interface DefiLlamaResponse {
  status: string;
  data: YieldPool[];
}

// ===== Morpho Blue Market =====

export type RiskLevel = "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "unknown";

export interface MorphoMarket {
  id: string;
  loanAsset: { symbol: string; decimals: number; address: string };
  collateralAsset: {
    symbol: string;
    decimals: number;
    address: string;
  } | null;
  lltv: number;
  oracle: string;
  totalSupplyUsd: number;
  totalBorrowUsd: number;
  supplyApy: number;
  borrowApy: number;
  utilization: number;
  riskLevel: RiskLevel;
  chainId: number;
}

// ===== Filter / UI Types =====

export interface PoolFilters {
  chains?: string[];
  projects?: string[];
  symbols?: string[];
  exposure?: "single" | "multi" | null;
  stablecoinOnly?: boolean;
  minTvl?: number;
  minApy?: number;
  maxApy?: number;
  search?: string;
}

export type SortField =
  | "apy"
  | "tvlUsd"
  | "apyBase"
  | "apyReward"
  | "apyPct1D"
  | "apyPct7D"
  | "apyPct30D";

export type SortDirection = "asc" | "desc";

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface DashboardStats {
  totalTvl: number;
  averageApy: number;
  totalPools: number;
  chainsCount: number;
  topApyPools: YieldPool[];
  topTvlPools: YieldPool[];
  apyDistribution: {
    label: string;
    count: number;
    range: [number, number];
  }[];
  chainDistribution: { chain: string; count: number; tvl: number }[];
}
