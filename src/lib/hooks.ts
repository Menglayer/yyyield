"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  fetchDefiLlamaPools,
  fetchMorphoMarkets,
  fetchYieldzMarkets,
  fetchYieldzFeeInfo,
} from "./api";
import type {
  YieldPool,
  MorphoMarket,
  YieldzMarket,
  YieldzFeeInfo,
  PoolFilters,
  DashboardStats,
  SortConfig,
} from "./types";

// ===== Shared fetch cache (in-memory across hooks in same session) =====

let poolsCache: YieldPool[] | null = null;
let poolsCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 min

async function getCachedPools(): Promise<YieldPool[]> {
  const now = Date.now();
  if (poolsCache && now - poolsCacheTime < CACHE_TTL) {
    return poolsCache;
  }
  const data = await fetchDefiLlamaPools();
  poolsCache = data;
  poolsCacheTime = now;
  return data;
}

// ===== useYieldPools =====

export function useYieldPools(
  filters: PoolFilters = {},
  sort: SortConfig = { field: "tvlUsd", direction: "desc" },
  page = 1,
  pageSize = 50,
) {
  const [allPools, setAllPools] = useState<YieldPool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getCachedPools()
      .then((data) => {
        if (!cancelled) {
          setAllPools(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to fetch pools");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    let result = allPools;

    // Filter out outliers and zero-TVL
    result = result.filter((p) => !p.outlier && p.tvlUsd > 0 && p.apy >= 0);

    if (filters.chains && filters.chains.length > 0) {
      const chains = new Set(filters.chains);
      result = result.filter((p) => chains.has(p.chain));
    }

    if (filters.projects && filters.projects.length > 0) {
      const projects = new Set(filters.projects);
      result = result.filter((p) => projects.has(p.project));
    }

    if (filters.exposure) {
      result = result.filter((p) => p.exposure === filters.exposure);
    }

    if (filters.stablecoinOnly) {
      result = result.filter((p) => p.stablecoin);
    }

    if (filters.minTvl != null) {
      result = result.filter((p) => p.tvlUsd >= (filters.minTvl ?? 0));
    }

    if (filters.minApy != null) {
      result = result.filter((p) => p.apy >= (filters.minApy ?? 0));
    }

    if (filters.maxApy != null) {
      result = result.filter((p) => p.apy <= (filters.maxApy ?? Infinity));
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.symbol.toLowerCase().includes(q) ||
          p.project.toLowerCase().includes(q) ||
          p.chain.toLowerCase().includes(q),
      );
    }

    return result;
  }, [allPools, filters]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const dir = sort.direction === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      const va = a[sort.field] ?? 0;
      const vb = b[sort.field] ?? 0;
      return (va - vb) * dir;
    });
    return arr;
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  // Extract unique values for filter dropdowns
  const uniqueChains = useMemo(() => {
    const set = new Set<string>();
    for (const p of allPools) set.add(p.chain);
    return Array.from(set).sort();
  }, [allPools]);

  const uniqueProjects = useMemo(() => {
    const set = new Set<string>();
    for (const p of allPools) set.add(p.project);
    return Array.from(set).sort();
  }, [allPools]);

  return {
    pools: paginated,
    totalFiltered: sorted.length,
    totalPages,
    loading,
    error,
    uniqueChains,
    uniqueProjects,
    allPools,
  };
}

// ===== useMorphoMarkets =====

export function useMorphoMarkets(chainId?: number) {
  const [markets, setMarkets] = useState<MorphoMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchMorphoMarkets()
      .then((data) => {
        if (!cancelled) {
          setMarkets(
            chainId ? data.filter((m) => m.chainId === chainId) : data,
          );
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch Morpho markets",
          );
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [chainId]);

  return { markets, loading, error };
}

// ===== useDashboardStats =====

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const compute = useCallback((pools: YieldPool[]): DashboardStats => {
    const valid = pools.filter(
      (p) => !p.outlier && p.tvlUsd > 0 && p.apy >= 0 && p.apy < 1000,
    );

    const totalTvl = valid.reduce((sum, p) => sum + p.tvlUsd, 0);
    const averageApy =
      valid.length > 0
        ? valid.reduce((sum, p) => sum + p.apy, 0) / valid.length
        : 0;

    const chains = new Set(valid.map((p) => p.chain));

    const topApyPools = [...valid]
      .sort((a, b) => b.apy - a.apy)
      .slice(0, 5);

    const topTvlPools = [...valid]
      .sort((a, b) => b.tvlUsd - a.tvlUsd)
      .slice(0, 5);

    const apyRanges: { label: string; range: [number, number] }[] = [
      { label: "0-5%", range: [0, 5] },
      { label: "5-10%", range: [5, 10] },
      { label: "10-20%", range: [10, 20] },
      { label: "20-50%", range: [20, 50] },
      { label: "50%+", range: [50, Infinity] },
    ];

    const apyDistribution = apyRanges.map(({ label, range }) => ({
      label,
      range,
      count: valid.filter((p) => p.apy >= range[0] && p.apy < range[1]).length,
    }));

    const chainMap = new Map<string, { count: number; tvl: number }>();
    for (const p of valid) {
      const prev = chainMap.get(p.chain) ?? { count: 0, tvl: 0 };
      chainMap.set(p.chain, {
        count: prev.count + 1,
        tvl: prev.tvl + p.tvlUsd,
      });
    }
    const chainDistribution = Array.from(chainMap.entries())
      .map(([chain, v]) => ({ chain, ...v }))
      .sort((a, b) => b.tvl - a.tvl);

    return {
      totalTvl,
      averageApy,
      totalPools: valid.length,
      chainsCount: chains.size,
      topApyPools,
      topTvlPools,
      apyDistribution,
      chainDistribution,
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getCachedPools()
      .then((pools) => {
        if (!cancelled) {
          setStats(compute(pools));
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to compute stats",
          );
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [compute]);

  return { stats, loading, error };
}

// ===== Yieldz Markets =====

let yieldzCache: YieldzMarket[] | null = null;
let yieldzCacheTime = 0;

async function getCachedYieldzMarkets(): Promise<YieldzMarket[]> {
  const now = Date.now();
  if (yieldzCache && now - yieldzCacheTime < CACHE_TTL) {
    return yieldzCache;
  }
  const data = await fetchYieldzMarkets();
  yieldzCache = data;
  yieldzCacheTime = now;
  return data;
}

export function useYieldzMarkets(mode: "deposit" | "leverage" | "all" = "all") {
  const [allMarkets, setAllMarkets] = useState<YieldzMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getCachedYieldzMarkets()
      .then((data) => {
        if (!cancelled) {
          setAllMarkets(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "获取 Yieldz 市场数据失败",
          );
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const markets = useMemo(() => {
    if (mode === "deposit") {
      return allMarkets.filter((m) => m.collateral_asset === null);
    }
    if (mode === "leverage") {
      return allMarkets.filter(
        (m) => m.collateral_asset !== null && Number(m.lltv) > 0,
      );
    }
    return allMarkets;
  }, [allMarkets, mode]);

  const uniqueChains = useMemo(() => {
    const set = new Set<string>();
    for (const m of markets) set.add(m.chain_name);
    return Array.from(set).sort();
  }, [markets]);

  const uniqueProtocols = useMemo(() => {
    const set = new Set<string>();
    for (const m of markets) set.add(m.protocol);
    return Array.from(set).sort();
  }, [markets]);

  return { markets, allMarkets, loading, error, uniqueChains, uniqueProtocols };
}

// ===== Yieldz Fee Info =====

export function useYieldzFeeInfo() {
  const [feeInfo, setFeeInfo] = useState<YieldzFeeInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchYieldzFeeInfo()
      .then((data) => {
        if (!cancelled) {
          setFeeInfo(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { feeInfo, loading };
}
