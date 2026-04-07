"use client";

import { motion } from "framer-motion";
import { Check, CircleDot, Circle } from "lucide-react";

type PhaseStatus = "completed" | "in_progress" | "upcoming";

interface Phase {
  id: string;
  title: string;
  description: string;
  status: PhaseStatus;
}

const phases: Phase[] = [
  {
    id: "Phase 1",
    title: "规划研究",
    description: "白皮书发布、团队组建、种子融资",
    status: "completed",
  },
  {
    id: "Phase 2",
    title: "基础设施",
    description: "智能合约开发、DEX 部署、流动性池",
    status: "completed",
  },
  {
    id: "Phase 3",
    title: "代币经济",
    description: "YZ 代币发行、治理框架、债券系统",
    status: "completed",
  },
  {
    id: "Phase 4",
    title: "用户增长",
    description: "社区营销、合作伙伴、生态激励",
    status: "in_progress",
  },
  {
    id: "Phase 5",
    title: "规模扩展",
    description: "跨链部署、机构合作、高级产品",
    status: "upcoming",
  },
];

export function Roadmap() {
  // Find index of current phase to fill the line properly
  const currentIndex = phases.findIndex((p) => p.status === "in_progress");
  const progressPercentage = currentIndex !== -1 ? (currentIndex / (phases.length - 1)) * 100 : 0;

  return (
    <section className="py-24 relative overflow-hidden" id="roadmap">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold mb-6 gradient-text"
          >
            发展路线
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto"
          >
            YYYield 的长期发展愿景与每个阶段的核心里程碑。
          </motion.p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Desktop continuous line background */}
          <div className="hidden md:block absolute top-6 left-0 w-full h-1 bg-[var(--border-default)] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)]"
              initial={{ width: "0%" }}
              whileInView={{ width: `${progressPercentage}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
            />
          </div>

          {/* Mobile continuous vertical line background */}
          <div className="md:hidden absolute top-0 left-[23px] h-full w-1 bg-[var(--border-default)] rounded-full overflow-hidden">
            <motion.div 
              className="w-full bg-gradient-to-b from-[var(--accent-start)] to-[var(--accent-end)]"
              initial={{ height: "0%" }}
              whileInView={{ height: `${progressPercentage}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between relative z-10 space-y-8 md:space-y-0">
            {phases.map((phase, index) => {
              const isCompleted = phase.status === "completed";
              const isInProgress = phase.status === "in_progress";
              
              return (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="flex md:flex-col items-start md:items-center relative w-full md:w-1/5 group"
                >
                  {/* Status Icon */}
                  <div className={`
                    flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center 
                    md:mb-6 z-10 bg-[var(--bg-primary)] border-4
                    ${isCompleted ? 'border-[var(--accent-start)] text-[var(--accent-start)]' : 
                      isInProgress ? 'border-[var(--accent-end)] text-[var(--accent-end)] shadow-[0_0_20px_rgba(0,180,216,0.4)]' : 
                      'border-[var(--border-default)] text-[var(--text-muted)]'}
                    transition-all duration-300
                  `}>
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : isInProgress ? (
                      <div className="w-4 h-4 rounded-full bg-[var(--accent-end)] animate-pulse" />
                    ) : (
                      <Circle className="w-5 h-5 opacity-50" />
                    )}
                  </div>

                  {/* Content box */}
                  <div className="ml-6 md:ml-0 md:text-center mt-1 md:mt-0 glass p-5 rounded-xl border border-[var(--border-default)] flex-1 w-full relative">
                    {/* Hover shine effect */}
                    <div className="card-shine absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
                    
                    <div className={`text-xs font-bold mb-2 uppercase tracking-wider
                      ${isCompleted ? 'text-[var(--accent-start)]' : 
                        isInProgress ? 'text-[var(--accent-end)]' : 
                        'text-[var(--text-muted)]'}
                    `}>
                      {phase.id}
                    </div>
                    <h3 className={`text-lg font-bold mb-2 
                      ${isCompleted || isInProgress ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}
                    `}>
                      {phase.title}
                    </h3>
                    <p className={`text-sm
                      ${isCompleted || isInProgress ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}
                    `}>
                      {phase.description}
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
