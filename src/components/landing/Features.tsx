"use client";

import { motion } from "framer-motion";
import { Activity, Globe, TrendingUp, ShieldCheck } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "实时收益数据",
      description:
        "聚合 DefiLlama 全量收益池数据，实时更新 APY、TVL 等核心指标，无需逐个协议查看",
      icon: Activity,
    },
    {
      title: "多链覆盖",
      description:
        "支持以太坊、Arbitrum、Base、Optimism、Polygon、Solana 等主流公链，一站式掌握全链收益机会",
      icon: Globe,
    },
    {
      title: "杠杆策略分析",
      description:
        "自动计算借贷循环的有效杠杆收益率，展示供应 APY、借款 APY、LTV 与最大杠杆倍数",
      icon: TrendingUp,
    },
    {
      title: "风险评估",
      description:
        "基于利用率、LTV、波动率等指标进行风险评级，帮助您在收益与安全之间做出明智选择",
      icon: ShieldCheck,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <section className="py-24 bg-[var(--bg-surface)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 gradient-text">
            核心功能
          </h2>
          <p className="text-[var(--text-secondary)] text-lg md:text-xl">
            为 DeFi 投资者打造的专业收益数据平台
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-8 hover:glow transition-all duration-300 group gradient-border"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--accent-start)]/20 to-[var(--accent-end)]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-7 h-7 text-[var(--accent-start)]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
