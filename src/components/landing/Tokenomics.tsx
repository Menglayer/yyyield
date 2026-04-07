"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function Tokenomics() {
  const yzFeatures = [
    "生态治理投票权",
    "质押获取 bYZ",
    "内置交易税收机制",
    "无增发功能，总量恒定",
  ];

  const byzFeatures = [
    "不可出售、不可转让",
    "1:1 兑换 YZ（到期后）",
    "享受手续费分成",
    "专属产品与费率优惠",
  ];

  return (
    <section className="py-24 relative overflow-hidden" id="tokenomics">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-[var(--accent-start)]/10 rounded-full blur-[120px] -translate-y-1/2 -z-10" />
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[var(--accent-end)]/10 rounded-full blur-[120px] -translate-y-1/2 -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold mb-6 gradient-text"
          >
            代币模型
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto"
          >
            双代币系统设计，平衡生态治理与长期激励，打造可持续的真实收益循环。
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* YZ Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative gradient-border rounded-2xl p-[1px]"
          >
            <div className="glass rounded-2xl p-8 h-full bg-[var(--bg-card)]/80 relative overflow-hidden group">
              <div className="card-shine absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                  YZ 治理代币
                </h3>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[var(--accent-start)]/10 text-[var(--accent-start)] border border-[var(--accent-start)]/20">
                  ERC-20
                </span>
              </div>
              
              <p className="text-[var(--text-secondary)] mb-8 relative z-10 min-h-[48px]">
                YYYield 生态系统的核心治理与效用代币
              </p>
              
              <ul className="space-y-4 relative z-10">
                {yzFeatures.map((feature) => (
                  <li key={feature} className="flex items-center text-[var(--text-primary)]">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--accent-start)]/10 flex items-center justify-center mr-3">
                      <Check className="w-3.5 h-3.5 text-[var(--accent-start)]" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* bYZ Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative gradient-border rounded-2xl p-[1px]"
          >
            <div className="glass rounded-2xl p-8 h-full bg-[var(--bg-card)]/80 relative overflow-hidden group">
              <div className="card-shine absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                  bYZ 加速凭证
                </h3>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[var(--accent-end)]/10 text-[var(--accent-end)] border border-[var(--accent-end)]/20">
                  不可转让
                </span>
              </div>
              
              <p className="text-[var(--text-secondary)] mb-8 relative z-10 min-h-[48px]">
                通过锁定 YZ 获取的专属权益凭证
              </p>
              
              <ul className="space-y-4 relative z-10">
                {byzFeatures.map((feature) => (
                  <li key={feature} className="flex items-center text-[var(--text-primary)]">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--accent-end)]/10 flex items-center justify-center mr-3">
                      <Check className="w-3.5 h-3.5 text-[var(--accent-end)]" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
