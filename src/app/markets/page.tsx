"use client";

import { useState, useCallback } from "react";
import AppSidebar from "@/components/AppSidebar";
import { useYieldPools } from "@/lib/hooks";
import type { PoolFilters, SortConfig, SortField, YieldPool } from "@/lib/types";
import {
  formatUsd,
  formatApy,
  getChainColor,
  getChainLabel,
  getProtocolLabel,
  getApyChangeColor,
  HIGHLIGHTED_CHAINS,
} from "@/lib/utils";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
} from "lucide-react";

// ===== Expandable Row Detail =====

function PoolDetail({ pool }: { pool: YieldPool }) {
  return (
    <tr>
      <td
        colSpan={8}
        className="px-6 py-4 bg-[var(--bg-elevated)] border-b border-[var(--border-default)]"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-[var(--text-muted)] block mb-1">基础 APY</span>
            <span className="text-[var(--text-primary)] tabular-nums">
              {formatApy(pool.apyBase)}
            </span>
          </div>
          <div>
            <span className="text-[var(--text-muted)] block mb-1">奖励 APY</span>
            <span className="text-[var(--text-primary)] tabular-nums">
              {formatApy(pool.apyReward)}
            </span>
          </div>
          <div>
            <span className="text-[var(--text-muted)] block mb-1">30 天均值</span>
            <span className="text-[var(--text-primary)] tabular-nums">
              {formatApy(pool.apyMean30d)}
            </span>
          </div>
          <div>
            <span className="text-[var(--text-muted)] block mb-1">敞口类型</span>
            <span className="text-[var(--text-primary)]">
              {pool.exposure === "single" ? "单一" : "多重"}
            </span>
          </div>
          <div>
            <span className="text-[var(--text-muted)] block mb-1">1 日变化</span>
            <span className={`tabular-nums ${getApyChangeColor(pool.apyPct1D)}`}>
              {pool.apyPct1D != null ? `${pool.apyPct1D > 0 ? "+" : ""}${pool.apyPct1D.toFixed(2)}%` : "-"}
            </span>
          </div>
          <div>
            <span className="text-[var(--text-muted)] block mb-1">7 日变化</span>
            <span className={`tabular-nums ${getApyChangeColor(pool.apyPct7D)}`}>
              {pool.apyPct7D != null ? `${pool.apyPct7D > 0 ? "+" : ""}${pool.apyPct7D.toFixed(2)}%` : "-"}
            </span>
          </div>
          <div>
            <span className="text-[var(--text-muted)] block mb-1">稳定币</span>
            <span className="text-[var(--text-primary)]">
              {pool.stablecoin ? "是" : "否"}
            </span>
          </div>
          <div>
            <span className="text-[var(--text-muted)] block mb-1">无常损失</span>
            <span className="text-[var(--text-primary)]">
              {pool.ilRisk === "no" ? "无" : "有"}
            </span>
          </div>
          {pool.rewardTokens && pool.rewardTokens.length > 0 && (
            <div className="col-span-2 md:col-span-4">
              <span className="text-[var(--text-muted)] block mb-1">奖励代币</span>
              <div className="flex flex-wrap gap-1">
                {pool.rewardTokens.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-0.5 rounded bg-white/5 text-[var(--text-secondary)] border border-[var(--border-default)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

// ===== Sort Header =====

function SortHeader({
  label,
  field,
  sort,
  onSort,
  align = "right",
}: {
  label: string;
  field: SortField;
  sort: SortConfig;
  onSort: (field: SortField) => void;
  align?: "left" | "right";
}) {
  const active = sort.field === field;
  return (
    <th
      className={`px-4 py-3 font-medium text-xs cursor-pointer select-none hover:text-[var(--text-primary)] transition-colors ${
        align === "right" ? "text-right" : "text-left"
      } ${active ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)]"}`}
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

// ===== Skeleton =====

function TableSkeleton() {
  const rows = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6", "sk-7", "sk-8", "sk-9", "sk-10"];
  return (
    <>
      {rows.map((k) => (
        <tr key={k}>
          <td className="px-4 py-3"><div className="h-4 w-20 bg-white/5 rounded animate-pulse" /></td>
          <td className="px-4 py-3"><div className="h-4 w-16 bg-white/5 rounded animate-pulse" /></td>
          <td className="px-4 py-3"><div className="h-4 w-14 bg-white/5 rounded animate-pulse" /></td>
          <td className="px-4 py-3"><div className="h-4 w-14 bg-white/5 rounded animate-pulse" /></td>
          <td className="px-4 py-3"><div className="h-4 w-16 bg-white/5 rounded animate-pulse" /></td>
          <td className="px-4 py-3"><div className="h-4 w-14 bg-white/5 rounded animate-pulse" /></td>
          <td className="px-4 py-3"><div className="h-4 w-10 bg-white/5 rounded animate-pulse" /></td>
          <td className="px-4 py-3"><div className="h-4 w-10 bg-white/5 rounded animate-pulse" /></td>
        </tr>
      ))}
    </>
  );
}

// ===== Main Page =====

export default function MarketsPage() {
  const [filters, setFilters] = useState<PoolFilters>({});
  const [sort, setSort] = useState<SortConfig>({
    field: "tvlUsd",
    direction: "desc",
  });
  const [page, setPage] = useState(1);
  const [expandedPool, setExpandedPool] = useState<string | null>(null);
  const [chainOpen, setChainOpen] = useState(false);

  const { pools, totalFiltered, totalPages, loading, error, uniqueChains } =
    useYieldPools(filters, sort, page, 50);

  const handleSort = useCallback(
    (field: SortField) => {
      setSort((prev) => ({
        field,
        direction:
          prev.field === field && prev.direction === "desc" ? "asc" : "desc",
      }));
      setPage(1);
    },
    [],
  );

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value || undefined }));
    setPage(1);
  }, []);

  const toggleChain = useCallback((chain: string) => {
    setFilters((prev) => {
      const current = prev.chains ?? [];
      const next = current.includes(chain)
        ? current.filter((c) => c !== chain)
        : [...current, chain];
      return { ...prev, chains: next.length > 0 ? next : undefined };
    });
    setPage(1);
  }, []);

  const toggleExposure = useCallback((exposure: "single" | "multi" | null) => {
    setFilters((prev) => ({ ...prev, exposure }));
    setPage(1);
  }, []);

  // Show highlighted chains first, then others
  const sortedChains = [...HIGHLIGHTED_CHAINS.filter((c) => uniqueChains.includes(c))];
  const otherChains = uniqueChains.filter((c) => !HIGHLIGHTED_CHAINS.includes(c));

  return (
    <AppSidebar>
      <div className="max-w-full mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-6">
          全部市场
        </h1>

        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              placeholder="搜索代币 / 协议 / 链..."
              onChange={handleSearch}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          {/* Chain filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setChainOpen((v) => !v)}
              className="px-4 py-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] text-sm text-[var(--text-secondary)] flex items-center gap-2 hover:border-[var(--border-hover)] transition-colors"
            >
              链
              {filters.chains && filters.chains.length > 0 && (
                <span className="text-xs bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] px-1.5 rounded">
                  {filters.chains.length}
                </span>
              )}
              <ChevronDown size={14} />
            </button>
            {chainOpen && (
              <div className="absolute top-full mt-1 left-0 z-30 w-64 max-h-72 overflow-y-auto bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg shadow-xl p-2">
                {sortedChains.map((chain) => (
                  <button
                    type="button"
                    key={chain}
                    onClick={() => toggleChain(chain)}
                    className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                      filters.chains?.includes(chain)
                        ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                        : "text-[var(--text-secondary)] hover:bg-white/5"
                    }`}
                  >
                    {getChainLabel(chain)}
                  </button>
                ))}
                {otherChains.length > 0 && (
                  <>
                    <div className="border-t border-[var(--border-default)] my-1" />
                    {otherChains.map((chain) => (
                      <button
                        type="button"
                        key={chain}
                        onClick={() => toggleChain(chain)}
                        className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                          filters.chains?.includes(chain)
                            ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                            : "text-[var(--text-secondary)] hover:bg-white/5"
                        }`}
                      >
                        {getChainLabel(chain)}
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Exposure toggle */}
          <div className="flex items-center gap-1 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg p-1">
            {([
              { label: "全部", value: null },
              { label: "单一", value: "single" as const },
              { label: "多重", value: "multi" as const },
            ]).map((opt) => (
              <button
                type="button"
                key={opt.label}
                onClick={() => toggleExposure(opt.value)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  filters.exposure === opt.value
                    ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Stablecoin toggle */}
          <button
            type="button"
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                stablecoinOnly: !prev.stablecoinOnly,
              }))
            }
            className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
              filters.stablecoinOnly
                ? "bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/30 text-[var(--accent-primary)]"
                : "bg-[var(--bg-card)] border-[var(--border-default)] text-[var(--text-secondary)]"
            }`}
          >
            稳定币
          </button>
        </div>

        {/* Results count */}
        <div className="text-xs text-[var(--text-muted)] mb-3">
          共 {loading ? "..." : totalFiltered.toLocaleString()} 个池
        </div>

        {/* Table */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[var(--bg-card)] z-10">
                <tr className="border-b border-[var(--border-default)]">
                  <th className="text-left px-4 py-3 font-medium text-xs text-[var(--text-muted)]">
                    资产
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-xs text-[var(--text-muted)]">
                    协议
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-xs text-[var(--text-muted)]">
                    链
                  </th>
                  <SortHeader
                    label="APY"
                    field="apy"
                    sort={sort}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label="TVL"
                    field="tvlUsd"
                    sort={sort}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label="基础 APY"
                    field="apyBase"
                    sort={sort}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label="7日变化"
                    field="apyPct7D"
                    sort={sort}
                    onSort={handleSort}
                  />
                  <th className="text-left px-4 py-3 font-medium text-xs text-[var(--text-muted)]">
                    敞口
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-default)]">
                {loading ? (
                  <TableSkeleton />
                ) : pools.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-12 text-center text-[var(--text-muted)]"
                    >
                      无匹配结果
                    </td>
                  </tr>
                ) : (
                  pools.map((pool) => (
                    <>
                      <tr
                        key={pool.pool}
                        className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                        onClick={() =>
                          setExpandedPool(
                            expandedPool === pool.pool ? null : pool.pool,
                          )
                        }
                      >
                        <td className="px-4 py-3 font-medium text-[var(--text-primary)] whitespace-nowrap">
                          {pool.symbol}
                          {pool.stablecoin && (
                            <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              稳定
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[var(--text-secondary)] whitespace-nowrap">
                          {getProtocolLabel(pool.project)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`text-xs px-2 py-0.5 rounded border ${getChainColor(pool.chain)}`}
                          >
                            {getChainLabel(pool.chain)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-emerald-400 font-medium tabular-nums whitespace-nowrap">
                          {formatApy(pool.apy)}
                        </td>
                        <td className="px-4 py-3 text-right text-[var(--text-secondary)] tabular-nums whitespace-nowrap">
                          {formatUsd(pool.tvlUsd)}
                        </td>
                        <td className="px-4 py-3 text-right text-[var(--text-secondary)] tabular-nums whitespace-nowrap">
                          {formatApy(pool.apyBase)}
                        </td>
                        <td
                          className={`px-4 py-3 text-right tabular-nums whitespace-nowrap ${getApyChangeColor(pool.apyPct7D)}`}
                        >
                          {pool.apyPct7D != null
                            ? `${pool.apyPct7D > 0 ? "+" : ""}${pool.apyPct7D.toFixed(2)}%`
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-[var(--text-muted)] whitespace-nowrap">
                          {pool.exposure === "single" ? "单一" : "多重"}
                        </td>
                      </tr>
                      {expandedPool === pool.pool && (
                        <PoolDetail key={`detail-${pool.pool}`} pool={pool} />
                      )}
                    </>
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
      </div>
    </AppSidebar>
  );
}
