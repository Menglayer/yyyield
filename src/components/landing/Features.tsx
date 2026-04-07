"use client";

import { motion } from "framer-motion";
import { Shield, TrendingUp, Users, Umbrella, Lock, Gift } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "债券机制",
      description: "锁定稳定币，逐步获取 YZ 代币，实现风险可控的稳定收益",
      icon: Lock,
    },
    {
      title: "APY 加速器",
      description: "通过牺牲部分代币获取更高收益倍率，激励长期参与",
      icon: TrendingUp,
    },
    {
      title: "DAO 治理",
      description: "代币持有者共同决策，社区驱动协议发展方向",
      icon: Users,
    },
    {
      title: "收益保险基金",
      description: "专项储备金稳定收益分发，保障用户利益",
      icon: Shield,
    },
    {
      title: "价格底池",
      description: "内置价格支撑机制，防止代币价格剧烈波动",
      icon: Umbrella,
    },
    {
      title: "多重奖励",
      description: "bYZ 持有者享受协议手续费分成与月度额外奖励",
      icon: Gift,
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
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-24 bg-[var(--bg-surface)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 gradient-text">
            核心特性
          </h2>
          <p className="text-[var(--text-secondary)] text-lg md:text-xl">
            多层架构设计，解决 DeFi 核心痛点
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
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
