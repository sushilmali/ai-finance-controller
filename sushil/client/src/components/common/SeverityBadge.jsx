import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

export const SeverityBadge = ({ severity = 'Medium' }) => {
  const sev = (severity || 'Medium').toLowerCase();

  if (sev === 'high') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
        High Risk
      </span>
    );
  }

  if (sev === 'medium') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
        Medium
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
      <Info className="w-3.5 h-3.5 text-blue-400" />
      Low
    </span>
  );
};

export default SeverityBadge;
