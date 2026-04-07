"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { ShieldAlert } from "lucide-react";

export default function StrategiesPage() {
  const strategies = [
    {
      id: "stablecoin-bond",
      title: "稳定币债券策略",
      risk: "低风险",
      riskColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
      apy: "8.5% - 12%",
      lockPeriod: "30-90 天",
      minDeposit: "100 USDT",
      description: "将稳定币锁入债券合约，按固定周期获取 YZ 代币奖励。本金安全，收益稳定，适合保守型投资者。",
      tags: ["稳定币", "低风险", "固定收益"],
    },
    {
      id: "yz-staking",
      title: "YZ 质押加速",
      risk: "中风险",
      riskColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
      apy: "18% - 32%",
      lockPeriod: "90-180 天",
      minDeposit: "500 YZ",
      description: "质押 YZ 代币获取 bYZ 加速凭证，享受更高收益倍率。锁定期越长，加速效果越显著。",
      tags: ["质押", "加速", "bYZ"],
    },
    {
      id: "liquidity-mining",
      title: "流动性挖矿",
      risk: "中高风险",
      riskColor: "text-orange-400 bg-orange-400/10 border-orange-400/20",
      apy: "24% - 48%",
      lockPeriod: "无锁定",
      minDeposit: "等值 200 USD",
      description: "为核心交易对提供流动性，赚取交易手续费与额外 YZ 代币激励。灵活进出，收益丰厚。",
      tags: ["LP", "灵活", "高收益"],
    },
    {
      id: "dao-governance",
      title: "DAO 治理质押",
      risk: "低风险",
      riskColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
      apy: "6% - 10%",
      lockPeriod: "7 天",
      minDeposit: "100 YZ",
      description: "参与 DAO 治理投票的同时获取基础质押收益。最低门槛参与，享受治理权利与被动收入。",
      tags: ["治理", "投票", "低门槛"],
    },
    {
      id: "yield-aggregator",
      title: "复合收益聚合",
      risk: "中风险",
      riskColor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
      apy: "15% - 28%",
      lockPeriod: "30 天",
      minDeposit: "300 USDT",
      description: "自动将多种收益源聚合再投资，通过智能复利最大化长期回报。省心省力的一站式方案。",
      tags: ["复利", "自动化", "聚合"],
    },
    {
      id: "insurance-vault",
      title: "保险金库",
      risk: "极低风险",
      riskColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
      apy: "4% - 6%",
      lockPeriod: "14 天",
      minDeposit: "50 USDT",
      description: "资金存入收益保险基金，为协议提供安全保障的同时获取稳定低收益。资金安全性最高。",
      tags: ["保险", "安全", "保守"],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-[var(--accent-start)]/30 flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] gradient-text"
          >
            收益策略
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto"
          >
            探索多种经过验证的收益策略，选择最适合您的方案
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {strategies.map((strategy) => (
            <motion.div
              key={strategy.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-[var(--bg-card)] rounded-2xl p-6 border border-white/5 shadow-xl transition-all duration-300 hover:border-[var(--accent-start)]/30 hover:shadow-[0_0_30px_rgba(0,212,170,0.1)] relative overflow-hidden group flex flex-col"
            >
              {/* Decorative top gradient */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold tracking-wide">{strategy.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${strategy.riskColor}`}>
                  {strategy.risk}
                </span>
              </div>

              <div className="mb-6">
                <div className="text-sm text-[var(--text-secondary)] mb-1">预期年化收益率 (APY)</div>
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] gradient-text inline-block">
                  {strategy.apy}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[var(--bg-elevated)] rounded-xl p-3 border border-white/5">
                  <div className="text-xs text-[var(--text-secondary)] mb-1">锁定期</div>
                  <div className="font-semibold text-sm">{strategy.lockPeriod}</div>
                </div>
                <div className="bg-[var(--bg-elevated)] rounded-xl p-3 border border-white/5">
                  <div className="text-xs text-[var(--text-secondary)] mb-1">最低参与金额</div>
                  <div className="font-semibold text-sm">{strategy.minDeposit}</div>
                </div>
              </div>

              <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6 flex-grow">
                {strategy.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
                {strategy.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-white/5 text-[var(--text-muted)] text-xs rounded-md font-medium border border-white/5">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 bg-[#06070b]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-start space-x-4 max-w-4xl mx-auto"
        >
          <ShieldAlert className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            <span className="font-semibold text-amber-500/90">风险提示：</span> 以上策略收益率为历史数据参考，不构成投资建议。DeFi 投资存在智能合约风险、市场波动风险等，请根据自身风险承受能力谨慎参与。
          </p>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
