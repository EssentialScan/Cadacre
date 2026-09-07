"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { 
  LayoutDashboard, 
  Map, 
  PieChart, 
  Activity, 
  TrendingUp, 
  Users, 
  Bell, 
  BookOpen,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Image from "next/image";

export function AppLayout({ children, isPro }: { children: React.ReactNode, isPro: boolean }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Asset Map", href: "/explore", icon: Map },
    { label: "Portfolio", href: "/portfolio", icon: PieChart, pro: true },
    { label: "Basket Builder", href: "/basket", icon: Activity },
    { label: "Modelling", href: "/modelling", icon: TrendingUp },
    { label: "Community", href: "/community", icon: Users },
    { label: "Alerts", href: "/alerts", icon: Bell, pro: true },
    { label: "API Docs", href: "/api-docs", icon: BookOpen },
  ];

  return (
    <div className="flex h-screen bg-[#F7F8FA] overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-border transition-all duration-300 flex flex-col ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="h-16 flex items-center px-4 border-b border-border/50 shrink-0 justify-between">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2 overflow-hidden">
              <Image src="/content.png" alt="REITCompare" width={24} height={24} className="h-6 w-6 shrink-0" />
              <span className="font-display font-bold text-foreground truncate">
                REIT<span className="text-primary">Compare</span>
              </span>
            </Link>
          )}
          {collapsed && (
            <Link href="/" className="mx-auto">
              <Image src="/content.png" alt="REITCompare" width={24} height={24} className="h-6 w-6" />
            </Link>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors relative group ${
                  isActive 
                    ? "bg-brand-blue/10 text-brand-blue font-semibold" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                } ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {!collapsed && item.pro && !isPro && (
                  <span className="ml-auto text-[9px] uppercase font-bold tracking-wider bg-brand-blue/10 text-brand-blue px-1.5 py-0.5 rounded shrink-0">Pro</span>
                )}
                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border/50">
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center py-2 text-muted-foreground hover:bg-muted/50 rounded-md transition-colors"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-border/50 flex items-center justify-end px-6 shrink-0">
          <div className="flex items-center gap-4">
            {!isPro && (
              <Link href="/#pricing" className="text-xs font-semibold text-brand-blue bg-brand-blue/10 px-3 py-1.5 rounded-full hover:bg-brand-blue/20 transition-colors">
                Upgrade to Pro
              </Link>
            )}
            <UserButton />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto relative">
          {children}
        </main>
      </div>
    </div>
  );
}
