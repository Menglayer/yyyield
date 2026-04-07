"use client";

import { motion } from "framer-motion";
import { Search, Lock, Wallet } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "选择策略",
      description: "浏览并选择适合您风险偏好的收益策略",
      icon: Search,
    },
    {
      num: "02",
      title: "锁定资产",
      description: "将稳定币或代币锁入智能合约，开始累积收益",
      icon: Lock,
    },
    {
      num: "03",
      title: "持续收益",
      description: "自动复利或手动提取，享受可持续的真实收益",
      icon: Wallet,
    },
  ];

  return (
    <section className="py-24 bg-[var(--bg-primary)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
            运作原理
          </h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[4.5rem] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] opacity-30 border-t border-dashed border-[var(--accent-start)] z-0" />

          {/* Connecting Line (Mobile) */}
          <div className="block md:hidden absolute left-[3.25rem] top-[4rem] bottom-[4rem] w-[2px] bg-gradient-to-b from-[var(--accent-start)] to-[var(--accent-end)] opacity-30 border-l border-dashed border-[var(--accent-start)] z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative z-10 flex flex-row md:flex-col items-start md:items-center gap-6 md:gap-0"
                >
                  <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full bg-[var(--bg-elevated)] border-2 border-[var(--accent-start)] flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,212,170,0.15)] md:mb-8 glass">
                    <Icon className="w-8 h-8 md:w-10 md:h-10 text-[var(--accent-start)] mb-1" />
                    <span className="text-[10px] md:text-xs font-bold text-[var(--text-secondary)]">
                      STEP {step.num}
                    </span>
                  </div>
                  
                  <div className="pt-2 md:pt-0 md:text-center">
                    <h3 className="text-xl md:text-2xl font-semibold text-[var(--text-primary)] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed text-sm md:text-base max-w-[280px] md:mx-auto">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
