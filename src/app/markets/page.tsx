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
  getTokenIconUrl,
  HIGHLIGHTED_CHAINS,
} from "@/lib/utils";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Info,
  X,
} from "lucide-react";

type MarketSortField =
  | "supply_apy"
  | "borrow_apy"
  | "total_supply_usd"
  | "liquidity_usd"
  | "utilization";

interface MarketSortConfig {
  field: MarketSortField;
  direction: "asc" | "desc";
}

function SortHeader({
  label,
  field,
  sort,
  onSort,
}: {
  label: string;
  field: MarketSortField;
  sort: MarketSortConfig;
  onSort: (field: MarketSortField) => void;
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

export default function MarketsPage() {
  const { markets, loading, error, uniqueChains, uniqueProtocols } =
    useYieldzMarkets("all");
  const { feeInfo } = useYieldzFeeInfo();

  const [search, setSearch] = useState("");
  const [selectedChains, setSelectedChains] = useState<string[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);
  const [marketType, setMarketType] = useState<string>("all");
  const [sort, setSort] = useState<MarketSortConfig>({
    field: "supply_apy",
    direction: "desc",
  });
  const [page, setPage] = useState(1);
  const [chainOpen, setChainOpen] = useState(false);
  const pageSize = 50;

  const hasActiveFilters =
    search !== "" ||
    selectedChains.length > 0 ||
    selectedProtocol !== null ||
    marketType !== "all";

  // Filter
  const filtered = useMemo(() => {
    let result = markets;

    if (selectedChains.length > 0) {
      const chains = new Set(selectedChains);
      result = result.filter((m) => chains.has(m.chain_name));
    }

    if (selectedProtocol) {
      result = result.filter((m) => m.protocol === selectedProtocol);
    }

    if (marketType === "borrow") {
      result = result.filter((m) => m.collateral_asset !== null);
    } else if (marketType === "deposit") {
      result = result.filter((m) => m.collateral_asset === null);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.loan_asset.symbol.toLowerCase().includes(q) ||
          (m.collateral_asset?.symbol.toLowerCase().includes(q)) ||
          m.chain_name.toLowerCase().includes(q) ||
          m.protocol.toLowerCase().includes(q),
      );
    }

    return result;
  }, [markets, selectedChains, selectedProtocol, marketType, search]);

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

  // Stats
  const stats = useMemo(() => {
    if (!filtered.length)
      return { count: 0, tvl: 0, avgSupplyApy: 0, avgBorrowApy: 0 };
    const tvl = filtered.reduce((sum, m) => sum + m.total_supply_usd, 0);
    const avgSupply =
      filtered.reduce((sum, m) => sum + m.supply_apy, 0) / filtered.length;
    const borrowMarkets = filtered.filter((m) => m.borrow_apy > 0);
    const avgBorrow =
      borrowMarkets.length > 0
        ? borrowMarkets.reduce((sum, m) => sum + m.borrow_apy, 0) /
          borrowMarkets.length
        : 0;
    return { count: filtered.length, tvl, avgSupplyApy: avgSupply, avgBorrowApy: avgBorrow };
  }, [filtered]);

  const handleSort = useCallback((field: MarketSortField) => {
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

  const clearAllFilters = useCallback(() => {
    setSearch("");
    setSelectedChains([]);
    setSelectedProtocol(null);
    setMarketType("all");
    setPage(1);
  }, []);

  const sortedChains = HIGHLIGHTED_CHAINS.filter((c) =>
    uniqueChains.includes(c),
  );
  const otherChains = uniqueChains.filter(
    (c) => !HIGHLIGHTED_CHAINS.includes(c),
  );

  const skeletonKeys = [
    "ms-1", "ms-2", "ms-3", "ms-4", "ms-5",
    "ms-6", "ms-7", "ms-8", "ms-9", "ms-10",
  ];

  return (
    <AppSidebar>
      <div className="max-w-full mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2">
          全部市场
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          查看和筛选所有 DeFi 借贷和存款市场，实时对比各协议收益率
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

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
            <div className="text-xs text-[var(--text-muted)] mb-1">总市场数</div>
            <div className="text-xl font-bold text-[var(--text-primary)]">
              {loading ? "..." : stats.count.toLocaleString()}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
            <div className="text-xs text-[var(--text-muted)] mb-1">总 TVL</div>
            <div className="text-xl font-bold text-[var(--text-primary)]">
              {loading ? "..." : formatUsd(stats.tvl)}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
            <div className="text-xs text-[var(--text-muted)] mb-1">平均供应 APY</div>
            <div className="text-xl font-bold text-emerald-400">
              {loading ? "..." : formatApy(stats.avgSupplyApy)}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
            <div className="text-xs text-[var(--text-muted)] mb-1">平均借款 APY</div>
            <div className="text-xl font-bold text-red-400">
              {loading ? "..." : formatApy(stats.avgBorrowApy)}
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              placeholder="搜索资产 / 协议 / 链..."
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

          {/* Market type filter */}
          <div className="flex items-center gap-1 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg p-1">
            {(["all", "borrow", "deposit"] as const).map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => {
                  setMarketType(type);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  marketType === type
                    ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {type === "all" ? "全部" : type === "borrow" ? "借贷" : "存款"}
              </button>
            ))}
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X size={14} />
              清除筛选
            </button>
          )}
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
                    资产
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-xs text-[var(--text-muted)]">
                    协议 / 链
                  </th>
                  <SortHeader
                    label="供应 APY"
                    field="supply_apy"
                    sort={sort}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label="借款 APY"
                    field="borrow_apy"
                    sort={sort}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label="TVL"
                    field="total_supply_usd"
                    sort={sort}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label="流动性"
                    field="liquidity_usd"
                    sort={sort}
                    onSort={handleSort}
                  />
                  <SortHeader
                    label="利用率"
                    field="utilization"
                    sort={sort}
                    onSort={handleSort}
                  />
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-default)]">
                {loading ? (
                  skeletonKeys.map((k) => (
                    <tr key={k}>
                      <td className="px-4 py-3"><div className="h-4 w-28 bg-white/5 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-24 bg-white/5 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-14 bg-white/5 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-14 bg-white/5 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-16 bg-white/5 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-16 bg-white/5 rounded animate-pulse" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-12 bg-white/5 rounded animate-pulse" /></td>
                    </tr>
                  ))
                ) : paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-[var(--text-muted)]"
                    >
                      没有找到符合条件的市场
                    </td>
                  </tr>
                ) : (
                  paginated.map((m) => (
                    <tr
                      key={`${m.protocol}-${m.id}-${m.chain_id}`}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-1.5">
                            <img
                              src={getTokenIconUrl(m.chain_id, m.loan_asset.address, m.loan_asset.symbol)}
                              alt={m.loan_asset.symbol}
                              className="w-6 h-6 rounded-full border border-[var(--bg-card)] bg-white/5 relative z-10"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = "none";
                                const fb = e.currentTarget.nextElementSibling as HTMLElement | null;
                                if (fb) fb.classList.remove("hidden");
                              }}
                            />
                            <div className="w-6 h-6 rounded-full border border-[var(--bg-card)] bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-medium hidden relative z-10">
                              {m.loan_asset.symbol.charAt(0)}
                            </div>
                            {m.collateral_asset && (
                              <>
                                <img
                                  src={getTokenIconUrl(m.chain_id, m.collateral_asset.address, m.collateral_asset.symbol)}
                                  alt={m.collateral_asset.symbol}
                                  className="w-6 h-6 rounded-full border border-[var(--bg-card)] bg-white/5 relative z-0"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = "none";
                                    const fb = e.currentTarget.nextElementSibling as HTMLElement | null;
                                    if (fb) fb.classList.remove("hidden");
                                  }}
                                />
                                <div className="w-6 h-6 rounded-full border border-[var(--bg-card)] bg-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-medium hidden relative z-0">
                                  {m.collateral_asset.symbol.charAt(0)}
                                </div>
                              </>
                            )}
                          </div>
                          <span className="font-medium text-[var(--text-primary)]">
                            {m.collateral_asset
                              ? `${m.loan_asset.symbol} / ${m.collateral_asset.symbol}`
                              : m.loan_asset.symbol}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-[var(--text-secondary)] text-xs mr-1.5">
                          {getProtocolLabel(m.protocol)}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded border ${getChainColor(m.chain_name)}`}
                        >
                          {getChainLabel(m.chain_name)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-400 font-medium tabular-nums whitespace-nowrap">
                        {formatApy(m.supply_apy)}
                      </td>
                      <td className="px-4 py-3 text-right text-red-400 tabular-nums whitespace-nowrap">
                        {m.borrow_apy > 0 ? (
                          formatApy(m.borrow_apy)
                        ) : (
                          <span className="text-[var(--text-muted)]">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-[var(--text-secondary)] tabular-nums whitespace-nowrap">
                        {formatUsd(m.total_supply_usd)}
                      </td>
                      <td className="px-4 py-3 text-right text-[var(--text-secondary)] tabular-nums whitespace-nowrap">
                        {formatUsd(m.liquidity_usd)}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <span
                            className={`tabular-nums ${
                              m.utilization > 0.9
                                ? "text-red-400"
                                : m.utilization > 0.7
                                  ? "text-amber-400"
                                  : "text-[var(--text-secondary)]"
                            }`}
                          >
                            {formatPercent(m.utilization)}
                          </span>
                          <div className="w-12 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                m.utilization > 0.9
                                  ? "bg-red-400"
                                  : m.utilization > 0.7
                                    ? "bg-amber-400"
                                    : "bg-[var(--accent-primary)]"
                              }`}
                              style={{ width: `${Math.min(100, m.utilization * 100)}%` }}
                            />
                          </div>
                        </div>
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
      </div>
    </AppSidebar>
  );
}
