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
  ChevronRight,
  Settings
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
    <div className="flex h-screen bg-background overflow-hidden selection:bg-brand-blue/10">
      {/* Sidebar */}
      <aside 
        className={`relative z-20 bg-white border-r border-slate-200 transition-all duration-300 flex flex-col ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Professional Collapse Toggle */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm hover:text-slate-600 hover:shadow hover:scale-105 transition-all"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" strokeWidth={3} /> : <ChevronLeft className="h-3 w-3" strokeWidth={3} />}
        </button>

        <div className="h-16 flex items-center px-4 border-b border-slate-100 shrink-0 justify-between">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2 overflow-hidden">
              <Image src="/content.png" alt="REITCompare" width={24} height={24} className="h-6 w-6 shrink-0" />
              <span className="font-display font-bold text-slate-900 truncate">
                REIT<span className="text-brand-blue">Compare</span>
              </span>
            </Link>
          )}
          {collapsed && (
            <Link href="/" className="mx-auto">
              <Image src="/content.png" alt="REITCompare" width={24} height={24} className="h-6 w-6" />
            </Link>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative group ${
                  isActive 
                    ? "bg-brand-blue/5 text-brand-blue font-medium shadow-sm ring-1 ring-brand-blue/10" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                } ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-brand-blue" : "text-slate-400 group-hover:text-slate-600"}`} strokeWidth={isActive ? 2.5 : 2} />
                {!collapsed && <span className="truncate tracking-tight text-sm">{item.label}</span>}
                {!collapsed && item.pro && !isPro && (
                  <span className="ml-auto text-[10px] uppercase font-bold tracking-wider bg-brand-blue/10 text-brand-blue px-1.5 py-0.5 rounded shrink-0">Pro</span>
                )}
                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md shadow-elevated opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 flex flex-col gap-3">
          {!isPro && (
            <Link 
              href="/#pricing" 
              className={`flex items-center justify-center text-xs font-semibold text-brand-blue bg-brand-blue/5 px-3 py-2 rounded-lg hover:bg-brand-blue/10 transition-colors border border-brand-blue/10 ${collapsed ? 'hidden' : ''}`}
            >
              Upgrade to Pro
            </Link>
          )}
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between gap-2 p-1.5 -mx-1.5 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200'}`}>
            <div className="flex items-center gap-2.5 overflow-hidden">
              <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 shadow-sm ring-1 ring-slate-200" } }} />
              {!collapsed && (
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-semibold text-slate-900 truncate tracking-tight">Account</span>
                  <span className="text-[11px] text-slate-500 font-medium truncate">Manage settings</span>
                </div>
              )}
            </div>
            {!collapsed && (
              <Link href="/account" className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200/50 transition-colors" title="Account Settings">
                <Settings className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto relative">
          {children}
        </main>
      </div>
    </div>
  );
}
