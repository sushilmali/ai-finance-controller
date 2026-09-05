import React from 'react';
import {
  Briefcase,
  Megaphone,
  Code2,
  Plane,
  Utensils,
  Zap,
  Building2,
  Home,
  HeartPulse,
  ShoppingBag,
  TrendingUp,
  Tag
} from 'lucide-react';

const CATEGORY_STYLES = {
  Salaries: { bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: Briefcase },
  Marketing: { bg: 'bg-pink-500/15 text-pink-300 border-pink-500/30', icon: Megaphone },
  Software: { bg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30', icon: Code2 },
  Travel: { bg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30', icon: Plane },
  Food: { bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30', icon: Utensils },
  Utilities: { bg: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30', icon: Zap },
  Office: { bg: 'bg-blue-500/15 text-blue-300 border-blue-500/30', icon: Building2 },
  Rent: { bg: 'bg-purple-500/15 text-purple-300 border-purple-500/30', icon: Home },
  Healthcare: { bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30', icon: HeartPulse },
  Shopping: { bg: 'bg-orange-500/15 text-orange-300 border-orange-500/30', icon: ShoppingBag },
  Consulting: { bg: 'bg-teal-500/15 text-teal-300 border-teal-500/30', icon: TrendingUp },
  Sales: { bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: TrendingUp },
  Income: { bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: TrendingUp },
  Other: { bg: 'bg-slate-500/15 text-slate-300 border-slate-500/30', icon: Tag }
};

export const CategoryBadge = ({ category = 'Other', size = 'md' }) => {
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.Other;
  const Icon = style.icon;

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs gap-1' : 'px-2.5 py-1 text-xs font-medium gap-1.5';

  return (
    <span className={`inline-flex items-center rounded-full border ${style.bg} ${sizeClasses} transition-colors`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{category}</span>
    </span>
  );
};

export default CategoryBadge;
