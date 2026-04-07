import type { DefiLlamaResponse, YieldPool, MorphoMarket, RiskLevel } from "./types";

// ===== DefiLlama Yields API =====

const DEFILLAMA_URL = "https://yields.llama.fi/pools";

export async function fetchDefiLlamaPools(): Promise<YieldPool[]> {
  try {
    const res = await fetch(DEFILLAMA_URL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 }, // hint — ignored in static export but harmless
    });

    if (!res.ok) {
      console.error(`DefiLlama API error: ${res.status}`);
      return [];
    }

    const json: DefiLlamaResponse = await res.json();

    if (json.status !== "success" || !Array.isArray(json.data)) {
      console.error("DefiLlama API returned unexpected format");
      return [];
    }

    return json.data;
  } catch (err) {
    console.error("Failed to fetch DefiLlama pools:", err);
    return [];
  }
}

// ===== Morpho Blue GraphQL API =====

const MORPHO_URL = "https://blue-api.morpho.org/graphql";

const MORPHO_QUERY = `
  query MorphoMarkets {
    markets(first: 100) {
      items {
        id
        loanAsset {
          symbol
          decimals
          address
        }
        collateralAsset {
          symbol
          decimals
          address
        }
        lltv
        oracleAddress
        state {
          supplyApy
          borrowApy
          totalSupplyUsd
          totalBorrowUsd
          utilization
        }
        reallocatableLiquidityAssets
      }
    }
  }
`;

interface MorphoApiMarketItem {
  id: string;
  loanAsset: { symbol: string; decimals: number; address: string };
  collateralAsset: {
    symbol: string;
    decimals: number;
    address: string;
  } | null;
  lltv: number | string;
  oracleAddress: string;
  state: {
    supplyApy: number;
    borrowApy: number;
    totalSupplyUsd: number;
    totalBorrowUsd: number;
    utilization: number;
  } | null;
  reallocatableLiquidityAssets: string | null;
}

function deriveRiskLevel(utilization: number, lltv: number): RiskLevel {
  if (lltv <= 0.5 && utilization <= 0.5) return "A+";
  if (lltv <= 0.65 && utilization <= 0.6) return "A";
  if (lltv <= 0.75 && utilization <= 0.7) return "B+";
  if (lltv <= 0.8 && utilization <= 0.8) return "B";
  if (lltv <= 0.85 && utilization <= 0.85) return "C+";
  if (lltv <= 0.9 && utilization <= 0.9) return "C";
  if (lltv > 0.9 || utilization > 0.9) return "D";
  return "unknown";
}

export async function fetchMorphoMarkets(): Promise<MorphoMarket[]> {
  try {
    const res = await fetch(MORPHO_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query: MORPHO_QUERY }),
    });

    if (!res.ok) {
      console.error(`Morpho API error: ${res.status}`);
      return [];
    }

    const json = await res.json();
    const items: MorphoApiMarketItem[] =
      json?.data?.markets?.items ?? [];

    return items
      .filter((m) => m.state !== null)
      .map((m) => {
        const lltv =
          typeof m.lltv === "string"
            ? Number(m.lltv) / 1e18
            : m.lltv > 1
              ? m.lltv / 1e18
              : m.lltv;
        const utilization = m.state?.utilization ?? 0;
        return {
          id: m.id,
          loanAsset: m.loanAsset,
          collateralAsset: m.collateralAsset,
          lltv,
          oracle: m.oracleAddress ?? "",
          totalSupplyUsd: m.state?.totalSupplyUsd ?? 0,
          totalBorrowUsd: m.state?.totalBorrowUsd ?? 0,
          supplyApy: (m.state?.supplyApy ?? 0) * 100, // convert to percentage
          borrowApy: (m.state?.borrowApy ?? 0) * 100,
          utilization,
          riskLevel: deriveRiskLevel(utilization, lltv),
          chainId: 1, // Morpho Blue is Ethereum mainnet
        };
      });
  } catch (err) {
    console.error("Failed to fetch Morpho markets:", err);
    return [];
  }
}
