"use client";

import { useState, useMemo, useCallback } from "react";
import AppSidebar from "@/components/AppSidebar";
import { useYieldzMarkets, useYieldzFeeInfo } from "@/lib/hooks";
import {
  formatUsd,
  formatApy,
  formatPercent,
  getChainColor,
  getChainLabel,
  getProtocolLabel,
  getRiskColor,
  getTokenIconUrl,
  getProtocolMarketUrl,
  lltvBpsToRatio,
  computeEffectiveLeverageApy,
  computeMaxLeverage,
  HIGHLIGHTED_CHAINS,
} from "@/lib/utils";
import type { RiskLevel } from "@/lib/types";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  AlertTriangle,
  Info,
  ExternalLink,
} from "lucide-react";

type LeverageSortField =
  | "supplyApy"
  | "borrowApy"
  | "effectiveApy"
  | "totalSupplyUsd"
  | "liquidityUsd"
  | "utilization"
  | "lltv";

interface LeverageSortConfig {
  field: LeverageSortField;
  direction: "asc" | "desc";
}

/** Derive a risk grade from utilization + LTV */
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

interface AugmentedMarket {
  id: string;
  marketId: string; // raw market id for protocol URL
  protocol: string;
  chainName: string;
  chainId: number;
  loanSymbol: string;
  loanAddress: string;
  collateralSymbol: string;
  collateralAddress: string;
  supplyApy: number;
  borrowApy: number;
  effectiveApy: number;
  maxLeverage: number;
  lltv: number; // ratio 0-1
  utilization: number;
  totalSupplyUsd: number;
  liquidityUsd: number;
  riskLevel: RiskLevel;
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

export default function BorrowPage() {
  const { markets, loading, error, uniqueChains, uniqueProtocols } =
    useYieldzMarkets("leverage");
  const { feeInfo } = useYieldzFeeInfo();

  const [search, setSearch] = useState("");
  const [selectedChains, setSelectedChains] = useState<string[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);
  const [sort, setSort] = useState<LeverageSortConfig>({
    field: "effectiveApy",
    direction: "desc",
  });
  const [page, setPage] = useState(1);
  const [chainOpen, setChainOpen] = useState(false);
  const pageSize = 50;

  // Augment with computed fields
  const augmented: AugmentedMarket[] = useMemo(() => {
    return markets.map((m) => {
      const ltvRatio = lltvBpsToRatio(m.lltv);
      return {
        id: `${m.protocol}-${m.id}-${m.chain_id}`,
        marketId: m.id,
        protocol: m.protocol,
        chainName: m.chain_name,
        chainId: m.chain_id,
        loanSymbol: m.loan_asset.symbol,
        loanAddress: m.loan_asset.address,
        collateralSymbol: m.collateral_asset?.symbol ?? "",
        collateralAddress: m.collateral_asset?.address ?? "",
        supplyApy: m.supply_apy,
        borrowApy: m.borrow_apy,
        effectiveApy: computeEffectiveLeverageApy(
          m.supply_apy,
          m.borrow_apy,
          ltvRatio,
        ),
        maxLeverage: computeMaxLeverage(ltvRatio),
        lltv: ltvRatio,
        utilization: m.utilization,
        totalSupplyUsd: m.total_supply_usd,
        liquidityUsd: m.liquidity_usd,
        riskLevel: deriveRiskLevel(m.utilization, ltvRatio),
      };
    });
  }, [markets]);

  // Filter
  const filtered = useMemo(() => {
    let result = augmented;

    if (selectedChains.length > 0) {
      const chains = new Set(selectedChains);
      result = result.filter((m) => chains.has(m.chainName));
    }

    if (selectedProtocol) {
      result = result.filter((m) => m.protocol === selectedProtocol);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.loanSymbol.toLowerCase().includes(q) ||
          m.collateralSymbol.toLowerCase().includes(q) ||
          m.chainName.toLowerCase().includes(q),
      );
    }

    return result;
  }, [augmented, selectedChains, selectedProtocol, search]);

  // Sort
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorted, page]);

  const handleSort = useCallback((field: LeverageSortField) => {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "desc" ? "asc" : "desc",
    }));
    setPage(1);
  }, []);

  const toggleChain = useCallback((chain: string) => {
    setSelectedChains((prev) => {
      const next = prev.includes(chain)
        ? prev.filter((c) => c !== chain)
        : [...prev, chain];
      return next;
    });
    setPage(1);
  }, []);

  const sortedChains = HIGHLIGHTED_CHAINS.filter((c) =>
    uniqueChains.includes(c),
  );
  const otherChains = uniqueChains.filter(
    (c) => !HIGHLIGHTED_CHAINS.includes(c),
  );

  const skeletonKeys = [
    "ls-1", "ls-2", "ls-3", "ls-4",
    "ls-5", "ls-6", "ls-7", "ls-8",
  ];

  return (
    <AppSidebar>
      <div className="max-w-full mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2">
          借贷市场
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Aave V3 与 Morpho 借贷市场的杠杆循环策略分析 — 有效杠杆 APY =
          (供应APY - 借款APY x LTV) / (1 - LTV)
        </p>

        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {feeInfo && (
          <div className="mb-4 p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <Info size={14} className="text-[var(--accent-primary)] shrink-0" />
            <span>{feeInfo.description}</span>
          </div>
        )}

        {/* Filters */}
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

          {/* Chain filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setChainOpen((v) => !v)}
              className="px-4 py-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] text-sm text-[var(--text-secondary)] flex items-center gap-2 hover:border-[var(--border-hover)] transition-colors"
            >
              链
              {selectedChains.length > 0 && (
                <span className="text-xs bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] px-1.5 rounded">
                  {selectedChains.length}
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
                      selectedChains.includes(chain)
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
                          selectedChains.includes(chain)
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

          {/* Protocol filter */}
          <div className="flex items-center gap-1 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg p-1">
            <button
              type="button"
              onClick={() => {
                setSelectedProtocol(null);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                selectedProtocol === null
                  ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              全部
            </button>
            {uniqueProtocols.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => {
                  setSelectedProtocol(p);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  selectedProtocol === p
                    ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {getProtocolLabel(p)}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-[var(--text-muted)] mb-3">
          共 {loading ? "..." : sorted.length.toLocaleString()} 个市场
        </div>

        {/* Table */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[var(--bg-card)] z-10">
                <tr className="border-b border-[var(--border-default)]">
                  <th className="text-left px-4 py-3 font-medium text-xs text-[var(--text-muted)]">
                    借贷对
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-xs text-[var(--text-muted)]">
                    协议 / 链
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
                  <SortHeader
                    label="流动性"
                    field="liquidityUsd"
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
                      <td className="px-4 py-3"><div className="h-4 w-28 bg-white/5 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-20 bg-white/5 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-14 bg-white/5 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-14 bg-white/5 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-16 bg-white/5 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-12 bg-white/5 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-12 bg-white/5 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-14 bg-white/5 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-14 bg-white/5 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-10 bg-white/5 rounded animate-pulse" /></td>
                    </tr>
                  ))
                ) : paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
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
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-1.5">
                            <img
                              src={getTokenIconUrl(m.chainId, m.loanAddress, m.loanSymbol)}
                              alt={m.loanSymbol}
                              className="w-6 h-6 rounded-full border border-[var(--bg-card)] bg-white/5 relative z-10"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = "none";
                                const fb = e.currentTarget.nextElementSibling as HTMLElement | null;
                                if (fb) fb.classList.remove("hidden");
                              }}
                            />
                            <div className="w-6 h-6 rounded-full border border-[var(--bg-card)] bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-medium hidden relative z-10">
                              {m.loanSymbol.charAt(0)}
                            </div>
                            {m.collateralSymbol && (
                              <>
                                <img
                                  src={getTokenIconUrl(m.chainId, m.collateralAddress, m.collateralSymbol)}
                                  alt={m.collateralSymbol}
                                  className="w-6 h-6 rounded-full border border-[var(--bg-card)] bg-white/5 relative z-0"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = "none";
                                    const fb = e.currentTarget.nextElementSibling as HTMLElement | null;
                                    if (fb) fb.classList.remove("hidden");
                                  }}
                                />
                                <div className="w-6 h-6 rounded-full border border-[var(--bg-card)] bg-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-medium hidden relative z-0">
                                  {m.collateralSymbol.charAt(0)}
                                </div>
                              </>
                            )}
                          </div>
                          <span className="font-medium text-[var(--text-primary)]">
                            {m.collateralSymbol
                              ? `${m.loanSymbol} / ${m.collateralSymbol}`
                              : m.loanSymbol}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[var(--text-secondary)] text-xs">
                            {getProtocolLabel(m.protocol)}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded border ${getChainColor(m.chainName)}`}
                          >
                            {getChainLabel(m.chainName)}
                          </span>
                          {(() => {
                            const url = getProtocolMarketUrl(m.protocol, m.chainId, m.marketId);
                            return url ? (
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors ml-0.5"
                                title="在协议中查看"
                              >
                                <ExternalLink size={12} />
                              </a>
                            ) : null;
                          })()}
                        </div>
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
                      <td className="px-4 py-3 text-right text-[var(--text-secondary)] tabular-nums whitespace-nowrap">
                        {formatUsd(m.liquidityUsd)}
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
