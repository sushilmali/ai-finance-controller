import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Bot,
  Settings,
  Database,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext.jsx';

export const Sidebar = ({ isMobileOpen, closeMobileSidebar }) => {
  const { dashboardData, handleLoadDemoData, loading } = useFinance();
  const anomalyCount = dashboardData?.kpis?.anomaliesCount || 0;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'AI Insights', path: '/insights', icon: Sparkles },
    {
      name: 'Anomalies',
      path: '/anomalies',
      icon: AlertTriangle,
      badge: anomalyCount > 0 ? anomalyCount : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
    },
    { name: 'Forecast', path: '/forecast', icon: TrendingUp },
    {
      name: 'AI Controller',
      path: '/controller',
      icon: Bot,
      highlight: true
    },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0B111E] border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20">
              <Zap className="w-5 h-5 font-bold" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div>
              <h1 className="text-base font-bold font-display tracking-tight text-white flex items-center gap-1.5">
                AI Finance <span className="text-emerald-400">Ctrl</span>
              </h1>
              <span className="text-[10px] font-semibold text-emerald-400/90 tracking-wider uppercase px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/50">
                Track 4 • Autonomous AI
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobileSidebar}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                } ${item.highlight ? 'ring-1 ring-emerald-500/30 bg-emerald-950/20' : ''}`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
              {item.highlight && !item.badge && (
                <span className="px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  AI
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* 1-Click Demo Data Action Box */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/30">
          <div className="p-3 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                Buildathon Demo
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                5-Min Ready
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">
              Populate 3-month dataset with engineered anomalies, duplicate charges & trends.
            </p>
            <button
              onClick={handleLoadDemoData}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {loading ? 'Populating...' : 'Load Demo Data'}
            </button>
          </div>

          {/* User Profile Mini Badge */}
          <div className="mt-3 flex items-center gap-2.5 px-2 py-1.5 text-xs text-slate-400">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] border border-emerald-500/40">
              FC
            </div>
            <div className="truncate">
              <p className="text-[11px] font-medium text-slate-200 truncate">Founder Demo Mode</p>
              <p className="text-[9px] text-slate-500 truncate">Apex Innovations Pvt Ltd</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
