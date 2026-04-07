"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface StatItemProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

function AnimatedNumber({ value, prefix = "", suffix = "", decimals = 0 }: Omit<StatItemProps, "label">) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const duration = 2000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      if (progress < duration) {
        const easeOutQuart = 1 - Math.pow(1 - progress / duration, 4);
        setDisplayValue(value * easeOutQuart);
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value, isInView]);

  return (
    <span ref={ref}>
      {prefix}
      {displayValue.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

export function Stats() {
  const stats: StatItemProps[] = [
    { label: "TVL", value: 128, prefix: "$", suffix: "M+" },
    { label: "活跃用户", value: 12000, suffix: "+" },
    { label: "平均APY", value: 24.8, suffix: "%", decimals: 1 },
    { label: "累计收益分发", value: 8.6, prefix: "$", suffix: "M+", decimals: 1 },
  ];

  return (
    <section className="py-20 bg-[var(--bg-primary)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass border border-[var(--border-default)] rounded-2xl p-6 text-center card-shine hover:glow transition-all"
            >
              <div className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2 gradient-text">
                <AnimatedNumber
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              </div>
              <div className="text-sm md:text-base text-[var(--text-secondary)]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
