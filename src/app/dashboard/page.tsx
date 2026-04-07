"use client";

import AppSidebar from "@/components/AppSidebar";
import { useDashboardStats } from "@/lib/hooks";
import { formatUsd, formatApy, getChainLabel, getChainColor, getProtocolLabel } from "@/lib/utils";
import { TrendingUp, DollarSign, Layers, Globe } from "lucide-react";

function SkeletonRow() {
  return (
    <tr>
      <td className="px-4 py-3"><div className="h-4 bg-white/5 rounded animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-4 bg-white/5 rounded animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-4 bg-white/5 rounded animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-4 bg-white/5 rounded animate-pulse" /></td>
    </tr>
  );
}

export default function DashboardPage() {
  const { stats, loading, error } = useDashboardStats();

  const statCards = [
    {
      label: "总锁仓量 (TVL)",
      value: stats ? formatUsd(stats.totalTvl) : "-",
      icon: DollarSign,
    },
    {
      label: "平均 APY",
      value: stats ? formatApy(stats.averageApy) : "-",
      icon: TrendingUp,
    },
    {
      label: "总池数量",
      value: stats ? stats.totalPools.toLocaleString() : "-",
      icon: Layers,
    },
    {
      label: "覆盖链数",
      value: stats ? String(stats.chainsCount) : "-",
      icon: Globe,
    },
  ];

  return (
    <AppSidebar>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-8">
          数据看板
        </h1>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            数据加载失败: {error}
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center">
                    <Icon size={18} className="text-[var(--accent-primary)]" />
                  </div>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {card.label}
                  </span>
                </div>
                <div className="text-2xl font-bold text-[var(--text-primary)] tabular-nums">
                  {loading ? (
                    <div className="h-7 w-28 bg-white/5 rounded animate-pulse" />
                  ) : (
                    card.value
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top APY Pools */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--border-default)]">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">
                最高收益率 Top 5
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[var(--text-muted)] text-xs">
                    <th className="text-left px-4 py-3 font-medium">资产</th>
                    <th className="text-left px-4 py-3 font-medium">协议</th>
                    <th className="text-right px-4 py-3 font-medium">APY</th>
                    <th className="text-right px-4 py-3 font-medium">TVL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-default)]">
                  {loading
                    ? ["s-apy-1", "s-apy-2", "s-apy-3", "s-apy-4", "s-apy-5"].map((k) => (
                        <SkeletonRow key={k} />
                      ))
                    : stats?.topApyPools.map((pool) => (
                        <tr
                          key={pool.pool}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                            {pool.symbol}
                          </td>
                          <td className="px-4 py-3 text-[var(--text-secondary)]">
                            {getProtocolLabel(pool.project)}
                          </td>
                          <td className="px-4 py-3 text-right text-emerald-400 font-medium tabular-nums">
                            {formatApy(pool.apy)}
                          </td>
                          <td className="px-4 py-3 text-right text-[var(--text-secondary)] tabular-nums">
                            {formatUsd(pool.tvlUsd)}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top TVL Pools */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--border-default)]">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">
                最高锁仓量 Top 5
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[var(--text-muted)] text-xs">
                    <th className="text-left px-4 py-3 font-medium">资产</th>
                    <th className="text-left px-4 py-3 font-medium">协议</th>
                    <th className="text-right px-4 py-3 font-medium">TVL</th>
                    <th className="text-right px-4 py-3 font-medium">APY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-default)]">
                  {loading
                    ? ["s-tvl-1", "s-tvl-2", "s-tvl-3", "s-tvl-4", "s-tvl-5"].map((k) => (
                        <SkeletonRow key={k} />
                      ))
                    : stats?.topTvlPools.map((pool) => (
                        <tr
                          key={pool.pool}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                            {pool.symbol}
                          </td>
                          <td className="px-4 py-3 text-[var(--text-secondary)]">
                            {getProtocolLabel(pool.project)}
                          </td>
                          <td className="px-4 py-3 text-right text-[var(--text-primary)] font-medium tabular-nums">
                            {formatUsd(pool.tvlUsd)}
                          </td>
                          <td className="px-4 py-3 text-right text-emerald-400 tabular-nums">
                            {formatApy(pool.apy)}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* APY Distribution */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--border-default)]">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">
                APY 分布
              </h2>
            </div>
            <div className="p-5 space-y-3">
              {loading
                ? ["s-d-1", "s-d-2", "s-d-3", "s-d-4", "s-d-5"].map((k) => (
                    <div
                      key={k}
                      className="h-8 bg-white/5 rounded animate-pulse"
                    />
                  ))
                : stats?.apyDistribution.map((bucket) => {
                    const maxCount = Math.max(
                      ...stats.apyDistribution.map((b) => b.count),
                    );
                    const pct =
                      maxCount > 0 ? (bucket.count / maxCount) * 100 : 0;
                    return (
                      <div key={bucket.label} className="flex items-center gap-3">
                        <span className="text-xs text-[var(--text-secondary)] w-14 text-right tabular-nums">
                          {bucket.label}
                        </span>
                        <div className="flex-1 h-6 bg-white/5 rounded-md overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[var(--accent-start)]/30 to-[var(--accent-end)]/30 rounded-md"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-[var(--text-muted)] w-12 tabular-nums">
                          {bucket.count.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
            </div>
          </div>

          {/* Chain Distribution */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--border-default)]">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">
                链分布 (按 TVL)
              </h2>
            </div>
            <div className="p-5 space-y-2 max-h-[320px] overflow-y-auto">
              {loading
                ? ["s-c-1", "s-c-2", "s-c-3", "s-c-4", "s-c-5", "s-c-6", "s-c-7", "s-c-8"].map((k) => (
                    <div
                      key={k}
                      className="h-8 bg-white/5 rounded animate-pulse"
                    />
                  ))
                : stats?.chainDistribution.slice(0, 15).map((item) => {
                    const maxTvl = stats.chainDistribution[0]?.tvl ?? 1;
                    const pct = (item.tvl / maxTvl) * 100;
                    return (
                      <div
                        key={item.chain}
                        className="flex items-center gap-3"
                      >
                        <span
                          className={`text-xs px-2 py-0.5 rounded border ${getChainColor(item.chain)} w-20 text-center truncate`}
                        >
                          {getChainLabel(item.chain)}
                        </span>
                        <div className="flex-1 h-5 bg-white/5 rounded overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[var(--accent-start)]/20 to-[var(--accent-end)]/20 rounded"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-[var(--text-muted)] w-16 text-right tabular-nums">
                          {formatUsd(item.tvl)}
                        </span>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>
    </AppSidebar>
  );
}
