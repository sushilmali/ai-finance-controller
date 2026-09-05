import React from 'react';

export const KPICard = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendText,
  colorScheme = 'emerald'
}) => {
  const colorMap = {
    emerald: {
      bg: 'from-emerald-500/10 to-transparent',
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]'
    },
    rose: {
      bg: 'from-rose-500/10 to-transparent',
      border: 'border-rose-500/20 hover:border-rose-500/40',
      iconBg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      glow: 'group-hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]'
    },
    indigo: {
      bg: 'from-indigo-500/10 to-transparent',
      border: 'border-indigo-500/20 hover:border-indigo-500/40',
      iconBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      glow: 'group-hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]'
    },
    amber: {
      bg: 'from-amber-500/10 to-transparent',
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]'
    }
  };

  const currentTheme = colorMap[colorScheme] || colorMap.emerald;

  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-[#0F172A]/90 p-6 border ${currentTheme.border} ${currentTheme.glow} transition-all duration-300 backdrop-blur-md`}>
      {/* Subtle top gradient glow */}
      <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${currentTheme.bg} blur-2xl group-hover:scale-125 transition-transform duration-500`} />
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">{title}</p>
          <h3 className="mt-2 text-2xl lg:text-3xl font-bold tracking-tight text-white font-display">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl border ${currentTheme.iconBg} backdrop-blur-sm transition-transform group-hover:scale-110 duration-300`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
        <span className="truncate">{subtext}</span>
        {trend && (
          <span className={`inline-flex items-center font-medium ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trendText}
          </span>
        )}
      </div>
    </div>
  );
};

export default KPICard;
