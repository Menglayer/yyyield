"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  LayoutList,
  Landmark,
  Zap,
  Menu,
  X,
  Send,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "数据看板", href: "/dashboard/", icon: BarChart3 },
  { label: "全部市场", href: "/markets/", icon: LayoutList },
  { label: "存款策略", href: "/deposit/", icon: Landmark },
  { label: "杠杆策略", href: "/leverage/", icon: Zap },
];

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

export default function AppSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden cursor-default"
          onClick={() => setSidebarOpen(false)}
          aria-label="关闭侧边栏"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[var(--bg-surface)] border-r border-[var(--border-default)] flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-[var(--border-default)]">
          <Link
            href="/"
            className="text-xl font-bold gradient-text tracking-tight"
          >
            YYYield
          </Link>
          <button
            type="button"
            className="ml-auto lg:hidden text-[var(--text-secondary)] hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Social links in sidebar footer */}
        <div className="px-6 py-4 border-t border-[var(--border-default)] flex items-center gap-4">
          <a
            href="https://x.com/menglayer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
            aria-label="Twitter / X"
          >
            <XIcon className="w-4 h-4" />
          </a>
          <a
            href="https://t.me/MengYaWeb3"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
            aria-label="Telegram"
          >
            <Send size={16} />
          </a>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="h-16 flex items-center px-4 border-b border-[var(--border-default)] bg-[var(--bg-surface)] lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="text-[var(--text-secondary)] hover:text-white mr-4"
          >
            <Menu size={24} />
          </button>
          <Link href="/" className="text-lg font-bold gradient-text">
            YYYield
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
