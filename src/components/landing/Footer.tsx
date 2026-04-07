import { Send } from "lucide-react";

const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function Footer() {
  return (
    <footer className="bg-[var(--bg-primary)] border-t border-[var(--border-default)] pt-16 pb-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[300px] bg-gradient-radial from-[var(--accent-end)]/5 to-transparent blur-[100px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 mb-16">
          {/* Column 1: Brand & Desc */}
          <div className="space-y-6">
            <div className="text-3xl font-black tracking-tighter text-white">
              <span className="gradient-text">YYY</span>ield
            </div>
            <p className="text-[var(--text-secondary)] text-lg max-w-xs">
              多层真实收益 DeFi 生态系统
            </p>
          </div>

          {/* Column 2: Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">产品</h4>
              <ul className="space-y-4">
                <li>
                  <a href="#staking" className="text-[var(--text-secondary)] hover:text-[var(--accent-start)] transition-colors">
                    质押
                  </a>
                </li>
                <li>
                  <a href="#bonds" className="text-[var(--text-secondary)] hover:text-[var(--accent-start)] transition-colors">
                    债券
                  </a>
                </li>
                <li>
                  <a href="#accelerator" className="text-[var(--text-secondary)] hover:text-[var(--accent-start)] transition-colors">
                    加速器
                  </a>
                </li>
                <li>
                  <a href="#strategies" className="text-[var(--text-secondary)] hover:text-[var(--accent-start)] transition-colors">
                    策略
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">资源</h4>
              <ul className="space-y-4">
                <li>
                  <a href="#docs" className="text-[var(--text-secondary)] hover:text-[var(--accent-start)] transition-colors">
                    文档
                  </a>
                </li>
                <li>
                  <a href="#audit" className="text-[var(--text-secondary)] hover:text-[var(--accent-start)] transition-colors">
                    审计报告
                  </a>
                </li>
                <li>
                  <a href="#community" className="text-[var(--text-secondary)] hover:text-[var(--accent-start)] transition-colors">
                    社区
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Socials */}
          <div className="md:justify-self-end">
            <h4 className="text-white font-bold mb-6 text-lg">加入我们</h4>
            <div className="flex gap-4">
              <a
                href="https://x.com/menglayer"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl glass border border-[var(--border-default)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-start)] hover:shadow-[0_0_15px_rgba(0,212,170,0.2)] transition-all duration-300"
                aria-label="Twitter / X"
              >
                <XIcon className="w-5 h-5" />
              </a>
              <a
                href="https://t.me/MengYaWeb3"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl glass border border-[var(--border-default)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent-end)] hover:shadow-[0_0_15px_rgba(0,180,216,0.2)] transition-all duration-300"
                aria-label="Telegram"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border-default)] pt-8 flex flex-col md:flex-row items-center justify-center text-center">
          <p className="text-[var(--text-muted)] text-sm">
            © 2025 YYYield. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
