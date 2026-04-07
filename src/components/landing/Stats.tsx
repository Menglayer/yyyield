"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useDashboardStats } from "@/lib/hooks";
import { formatUsd, formatApy } from "@/lib/utils";

interface StatItemProps {
  label: string;
  displayValue: string;
  loading: boolean;
}

function StatCard({ label, displayValue, loading }: StatItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isInView) setShow(true);
  }, [isInView]);

  return (
    <div
      ref={ref}
      className="glass border border-[var(--border-default)] rounded-2xl p-6 text-center card-shine hover:glow transition-all"
    >
      <div className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2 gradient-text tabular-nums">
        {loading ? (
          <span className="inline-block w-24 h-9 bg-white/5 rounded animate-pulse" />
        ) : show ? (
          displayValue
        ) : (
          "-"
        )}
      </div>
      <div className="text-sm md:text-base text-[var(--text-secondary)]">
        {label}
      </div>
    </div>
  );
}

export function Stats() {
  const { stats, loading } = useDashboardStats();

  const items = [
    {
      label: "总锁仓量",
      displayValue: stats ? formatUsd(stats.totalTvl) : "-",
    },
    {
      label: "覆盖池数",
      displayValue: stats ? stats.totalPools.toLocaleString() : "-",
    },
    {
      label: "平均 APY",
      displayValue: stats ? formatApy(stats.averageApy) : "-",
    },
    {
      label: "覆盖链数",
      displayValue: stats ? String(stats.chainsCount) : "-",
    },
  ];

  return (
    <section className="py-20 bg-[var(--bg-primary)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StatCard
                label={item.label}
                displayValue={item.displayValue}
                loading={loading}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
