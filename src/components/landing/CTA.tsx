"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden" id="cta">
      {/* Dynamic Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[var(--accent-start)]/10 to-transparent blur-[80px] -z-10 rounded-full" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
          className="relative glass rounded-3xl p-10 md:p-16 text-center border border-[var(--border-default)] overflow-hidden"
        >
          {/* Inner card glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[var(--accent-end)]/10 blur-[60px] rounded-full pointer-events-none" />

          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white relative z-10">
            探索全链收益机会
          </h2>
          <p className="text-[var(--text-secondary)] text-lg md:text-xl mb-10 max-w-2xl mx-auto relative z-10">
            实时数据驱动的 DeFi 收益聚合器，助您发现最优策略
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link
              href="/markets/"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] text-[var(--bg-primary)] font-bold text-lg hover:shadow-[0_0_20px_rgba(0,212,170,0.4)] transition-all duration-300 transform hover:-translate-y-1 text-center"
            >
              浏览市场
            </Link>
            <a
              href="https://t.me/MengYaWeb3"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass border border-[var(--border-default)] text-white font-bold text-lg hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-1 text-center"
            >
              加入社区
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
