"use client";

import { motion } from "framer-motion";

const partnersRow1 = [
  { id: "p1-1", name: "Core DAO" },
  { id: "p1-2", name: "ShadowSwap" },
  { id: "p1-3", name: "ChainSafe" },
  { id: "p1-4", name: "DeFiLlama" },
  { id: "p1-5", name: "Core DAO" },
  { id: "p1-6", name: "ShadowSwap" },
  { id: "p1-7", name: "ChainSafe" },
  { id: "p1-8", name: "DeFiLlama" },
];

const partnersRow2 = [
  { id: "p2-1", name: "CertiK" },
  { id: "p2-2", name: "Immunefi" },
  { id: "p2-3", name: "Dune Analytics" },
  { id: "p2-4", name: "The Graph" },
  { id: "p2-5", name: "CertiK" },
  { id: "p2-6", name: "Immunefi" },
  { id: "p2-7", name: "Dune Analytics" },
  { id: "p2-8", name: "The Graph" },
];

export function Partners() {
  return (
    <section className="py-24 relative overflow-hidden bg-[var(--bg-primary)]" id="partners">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mb-16">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold mb-6 gradient-text"
          >
            合作伙伴与集成
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto"
          >
            强大的生态伙伴网络，确保协议的安全、透明与高效运转。
          </motion.p>
        </div>
      </div>

      <div className="relative w-full flex flex-col gap-6 overflow-hidden mask-edges pb-4">
        {/* Row 1 - Scroll Left */}
        <div className="flex w-fit animate-marquee hover:pause">
          {partnersRow1.map((partner) => (
            <div
              key={partner.id}
              className="flex-shrink-0 mx-4 glass px-12 py-6 rounded-2xl border border-[var(--border-default)] min-w-[240px] flex items-center justify-center group"
            >
              <span className="text-xl md:text-2xl font-bold text-white group-hover:gradient-text transition-all duration-300">
                {partner.name}
              </span>
            </div>
          ))}
          {partnersRow1.map((partner) => (
            <div
              key={`clone-${partner.id}`}
              className="flex-shrink-0 mx-4 glass px-12 py-6 rounded-2xl border border-[var(--border-default)] min-w-[240px] flex items-center justify-center group"
            >
              <span className="text-xl md:text-2xl font-bold text-white group-hover:gradient-text transition-all duration-300">
                {partner.name}
              </span>
            </div>
          ))}
        </div>

        {/* Row 2 - Scroll Right */}
        <div className="flex w-fit animate-marquee-reverse hover:pause">
          {partnersRow2.map((partner) => (
            <div
              key={partner.id}
              className="flex-shrink-0 mx-4 glass px-12 py-6 rounded-2xl border border-[var(--border-default)] min-w-[240px] flex items-center justify-center group"
            >
              <span className="text-xl md:text-2xl font-bold text-white group-hover:gradient-text transition-all duration-300">
                {partner.name}
              </span>
            </div>
          ))}
          {partnersRow2.map((partner) => (
            <div
              key={`clone-${partner.id}`}
              className="flex-shrink-0 mx-4 glass px-12 py-6 rounded-2xl border border-[var(--border-default)] min-w-[240px] flex items-center justify-center group"
            >
              <span className="text-xl md:text-2xl font-bold text-white group-hover:gradient-text transition-all duration-300">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .mask-edges {
          mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
        }
        
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        
        .animate-marquee-reverse {
          animation: marquee-reverse 35s linear infinite;
        }
        
        .hover\\:pause:hover {
          animation-play-state: paused;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
}
