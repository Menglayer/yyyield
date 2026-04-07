"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--bg-primary)]">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] left-[15%] w-96 h-96 bg-[var(--accent-start)] rounded-full blur-[128px] opacity-20"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            x: [0, -40, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] right-[15%] w-[30rem] h-[30rem] bg-[var(--accent-end)] rounded-full blur-[128px] opacity-20"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[var(--text-primary)] mb-6">
            多层收益，
            <span className="gradient-text">持续增长</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
            YYYield 是首个多层真实收益 DeFi 生态系统，为您提供可持续、稳定的长期收益解决方案
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button type="button" className="w-full sm:w-auto px-8 py-4 rounded-full font-medium text-[#06070b] bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] hover:opacity-90 transition-opacity">
              开始探索
            </button>
            <button type="button" className="w-full sm:w-auto px-8 py-4 rounded-full font-medium text-[var(--text-primary)] border border-[var(--border-default)] hover:bg-[var(--bg-elevated)] transition-colors glass">
              了解更多
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
