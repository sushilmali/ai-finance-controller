import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Plus,
  UploadCloud,
  Globe,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  X
} from 'lucide-react';
import { useFinance, CURRENCY_SYMBOLS } from '../../context/FinanceContext.jsx';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ openMobileSidebar }) => {
  const {
    currency,
    setCurrency,
    openAddModal,
    setIsImportModalOpen,
    dashboardData
  } = useFinance();

  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const anomalies = dashboardData?.anomalies || [];
  const anomalyCount = anomalies.length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#080C14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Breadcrumbs / Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={openMobileSidebar}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            AI Intelligence Active
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Currency Switcher */}
        <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
          {Object.keys(CURRENCY_SYMBOLS).map((currKey) => (
            <button
              key={currKey}
              onClick={() => setCurrency(currKey)}
              className={`px-2 py-1 rounded-lg font-semibold transition-all ${
                currency === currKey
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {CURRENCY_SYMBOLS[currKey]} {currKey}
            </button>
          ))}
        </div>

        {/* Notifications / Anomalies Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            title="Notifications & Anomalies"
          >
            <Bell className="w-4 h-4" />
            {anomalyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center border-2 border-[#080C14] animate-pulse">
                {anomalyCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0F172A] border border-slate-700 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Alert Center</span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-white p-0.5 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {anomalyCount === 0 ? (
                <div className="text-center py-4 text-xs text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                  No active anomalies detected. All expenses normal.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {anomalies.map((anom, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/anomalies');
                      }}
                      className="cursor-pointer p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/40 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-slate-200 truncate">
                          {anom.transaction?.description || 'Spike'}
                        </span>
                        <span className="text-[10px] font-semibold text-rose-400">
                          {anom.severity}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-2">
                        {anom.reason}
                      </p>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/anomalies');
                    }}
                    className="w-full text-center text-xs font-semibold text-emerald-400 hover:text-emerald-300 pt-1"
                  >
                    View All Detected Anomalies →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CSV Import Button */}
        <button
          onClick={() => setIsImportModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-all hover:border-slate-700"
        >
          <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
          Import CSV
        </button>

        {/* Add Transaction Button */}
        <button
          onClick={() => openAddModal()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">Add Transaction</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
