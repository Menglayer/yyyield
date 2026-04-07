"use client";

import { useState, useMemo } from "react";
import AppSidebar from "@/components/AppSidebar";
import { useMorphoMarkets } from "@/lib/hooks";
import type { MorphoMarket } from "@/lib/types";
import {
  formatUsd,
  formatApy,
  formatPercent,
  getRiskColor,
} from "@/lib/utils";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  AlertTriangle,
} from "lucide-react";

type LeverageSortField =
  | "supplyApy"
  | "borrowApy"
  | "effectiveApy"
  | "totalSupplyUsd"
  | "utilization"
  | "lltv";

interface LeverageSortConfig {
  field: LeverageSortField;
  direction: "asc" | "desc";
}

function computeEffectiveApy(
  supplyApy: number,
  borrowApy: number,
  lltv: number,
): number {
  if (lltv >= 1 || lltv <= 0) return supplyApy;
  return (supplyApy - borrowApy * lltv) / (1 - lltv);
}

function computeMaxLeverage(lltv: number): number {
  if (lltv >= 1 || lltv <= 0) return 1;
  return 1 / (1 - lltv);
}

function SortHeader({
  label,
  field,
  sort,
  onSort,
}: {
  label: string;
  field: LeverageSortField;
  sort: LeverageSortConfig;
  onSort: (field: LeverageSortField) => void;
}) {
  const active = sort.field === field;
  return (
    <th
      className={`px-4 py-3 font-medium text-xs text-right cursor-pointer select-none hover:text-[var(--text-primary)] transition-colors ${
        active ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)]"
      }`}
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active ? (
          sort.direction === "asc" ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          )
        ) : (
          <ChevronsUpDown size={14} className="opacity-40" />
        )}
      </span>
    </th>
  );
}

// Augmented market with computed fields
interface AugmentedMarket extends MorphoMarket {
  effectiveApy: number;
  maxLeverage: number;
  liquidationBuffer: number;
}

export default function LeveragePage() {
  const { markets, loading, error } = useMorphoMarkets();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<LeverageSortConfig>({
    field: "effectiveApy",
    direction: "desc",
  });
  const [page, setPage] = useState(1);
  const pageSize = 50;

  // Augment with computed fields
  const augmented: AugmentedMarket[] = useMemo(() => {
    return markets
      .filter((m) => m.collateralAsset !== null && m.lltv > 0)
      .map((m) => ({
        ...m,
        effectiveApy: computeEffectiveApy(m.supplyApy, m.borrowApy, m.lltv),
        maxLeverage: computeMaxLeverage(m.lltv),
        liquidationBuffer: 1 - m.utilization,
      }));
  }, [markets]);

  // Filter by search
  const filtered = useMemo(() => {
    if (!search) return augmented;
    const q = search.toLowerCase();
    return augmented.filter(
      (m) =>
        m.loanAsset.symbol.toLowerCase().includes(q) ||
        (m.collateralAsset?.symbol.toLowerCase().includes(q) ?? false),
    );
  }, [augmented, search]);

  // Sort
  const sorted = useMemo(() => {
    const arr = [...filtered];
    const dir = sort.direction === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      const va = a[sort.field] ?? 0;
      const vb = b[sort.field] ?? 0;
      return ((va as number) - (vb as number)) * dir;
    });
    return arr;
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorted, page]);

  const handleSort = (field: LeverageSortField) => {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "desc" ? "asc" : "desc",
    }));
    setPage(1);
  };

  const skeletonKeys = ["ls-1", "ls-2", "ls-3", "ls-4", "ls-5", "ls-6", "ls-7", "ls-8"];

  return (
    <AppSidebar>
      <div className="max-w-full mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2">
          杠杆策略
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Morpho Blue 借贷市场的杠杆循环策略分析 — 有效杠杆 APY =
          (供应APY - 借款APY x LTV) / (1 - LTV)
        </p>

        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Filter */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              placeholder="搜索资产..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>
        </div>

        <div className="text-xs text-[var(--text-muted)] mb-3">
          共 {loading ? "..." : sorted.length} 个市场
        </div>

        {/* Table */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[var(--bg-card)] z-10">
                <tr className="border-b border-[var(--border-default)]">
                  <th className="text-left px-4 py-3 font-medium text-xs text-[var(--text-muted)]">
                    借贷资产
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-xs text-[var(--text-muted)]">
                    抵押资产
                  </th>
                  <SortHeader
                    label="供应 APY"
                    field="supplyApy"
                    sort={sort}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label="借款 APY"
                    field="borrowApy"
                    sort={sort}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label="有效杠杆 APY"
                    field="effectiveApy"
                    sort={sort}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label="LLTV"
                    field="lltv"
                    sort={sort}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label="利用率"
                    field="utilization"
                    sort={sort}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label="TVL"
                    field="totalSupplyUsd"
                    sort={sort}
                    onSort={handleSort}
                  />
                  <th className="text-center px-4 py-3 font-medium text-xs text-[var(--text-muted)]">
                    风险
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-default)]">
                {loading ? (
                  skeletonKeys.map((k) => (
                    <tr key={k}>
                      <td className="px-4 py-3"><div className="h-4 w-16 bg-white/5 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-16 bg-white/5 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-14 bg-white/5 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-14 bg-white/5 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-16 bg-white/5 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-12 bg-white/5 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-12 bg-white/5 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-14 bg-white/5 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-10 bg-white/5 rounded animate-pulse" /></td>
                    </tr>
                  ))
                ) : paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-12 text-center text-[var(--text-muted)]"
                    >
                      无匹配结果
                    </td>
                  </tr>
                ) : (
                  paginated.map((m) => (
                    <tr
                      key={m.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-[var(--text-primary)] whitespace-nowrap">
                        {m.loanAsset.symbol}
                      </td>
                      <td className="px-4 py-3 text-[var(--text-secondary)] whitespace-nowrap">
                        {m.collateralAsset?.symbol ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-400 tabular-nums whitespace-nowrap">
                        {formatApy(m.supplyApy)}
                      </td>
                      <td className="px-4 py-3 text-right text-red-400 tabular-nums whitespace-nowrap">
                        {formatApy(m.borrowApy)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium tabular-nums whitespace-nowrap">
                        <span
                          className={
                            m.effectiveApy > 0
                              ? "text-emerald-400"
                              : "text-red-400"
                          }
                        >
                          {formatApy(m.effectiveApy)}
                        </span>
                        <span className="text-[var(--text-muted)] text-xs ml-1">
                          ({m.maxLeverage.toFixed(1)}x)
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-[var(--text-secondary)] tabular-nums whitespace-nowrap">
                        {formatPercent(m.lltv)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">
                        <span
                          className={
                            m.utilization > 0.9
                              ? "text-red-400"
                              : m.utilization > 0.7
                                ? "text-amber-400"
                                : "text-[var(--text-secondary)]"
                          }
                        >
                          {formatPercent(m.utilization)}
                        </span>
                        {m.utilization > 0.9 && (
                          <AlertTriangle
                            size={12}
                            className="inline ml-1 text-red-400"
                          />
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-[var(--text-secondary)] tabular-nums whitespace-nowrap">
                        {formatUsd(m.totalSupplyUsd)}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <span
                          className={`text-xs px-2 py-0.5 rounded border ${getRiskColor(m.riskLevel)}`}
                        >
                          {m.riskLevel}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-[var(--text-muted)]">
              第 {page} / {totalPages} 页
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-secondary)] disabled:opacity-30 hover:bg-white/5 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] text-[var(--text-secondary)] disabled:opacity-30 hover:bg-white/5 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Formula explanation */}
        <div className="mt-6 p-4 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl">
          <h3 className="text-sm font-medium text-[var(--text-primary)] mb-2">
            杠杆收益计算公式
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            有效杠杆 APY = (供应APY - 借款APY x LTV) / (1 - LTV)
            <br />
            最大杠杆倍数 = 1 / (1 - LLTV)
            <br />
            风险等级基于利用率与 LLTV 综合评估。高利用率意味着流动性紧张，清算风险增加。
          </p>
        </div>
      </div>
    </AppSidebar>
  );
}
