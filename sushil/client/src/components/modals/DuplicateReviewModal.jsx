import React, { useState } from 'react';
import { Copy, Trash2, CheckCircle2, X, AlertTriangle } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext.jsx';
import { apiClient } from '../../api/client.js';

export const DuplicateReviewModal = ({ duplicates = [] }) => {
  const { isDuplicateModalOpen, setIsDuplicateModalOpen, refreshDashboard, formatCurrency } = useFinance();
  const [resolvingId, setResolvingId] = useState(null);

  const handleDeleteDuplicate = async (transactionId) => {
    setResolvingId(transactionId);
    try {
      await apiClient.deleteTransaction(transactionId);
      await refreshDashboard(false);
    } catch (err) {
      console.error('Failed to delete duplicate:', err);
    } finally {
      setResolvingId(null);
    }
  };

  if (!isDuplicateModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0F172A] border border-slate-700 shadow-2xl p-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Copy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Duplicate Transactions Review
              </h3>
              <p className="text-xs text-slate-400">
                Identical or near-identical charges occurring within a 4-day window.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDuplicateModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of duplicate groups */}
        <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1">
          {duplicates.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
              <p className="text-xs font-semibold text-slate-200">No duplicates detected</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Your transactions list is clean of redundant entries.</p>
            </div>
          ) : (
            duplicates.map((group, gIdx) => (
              <div
                key={gIdx}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{group.description}</span>
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      {formatCurrency(group.amount)} each
                    </span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    {group.count} Matching Charges
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mb-3">{group.reason}</p>

                <div className="space-y-2">
                  {group.transactions.map((tx, idx) => (
                    <div
                      key={tx._id || idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs"
                    >
                      <div>
                        <span className="text-slate-300 font-medium">{tx.description}</span>
                        <span className="text-[10px] text-slate-500 ml-2">
                          {new Date(tx.date).toLocaleDateString()}
                        </span>
                        {idx === 0 && (
                          <span className="ml-2 text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                            Original
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono font-semibold text-slate-200">
                          {formatCurrency(tx.amount)}
                        </span>
                        {idx > 0 && (
                          <button
                            onClick={() => handleDeleteDuplicate(tx._id)}
                            disabled={resolvingId === tx._id}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/30"
                            title="Remove this duplicate charge"
                          >
                            <Trash2 className="w-3 h-3" />
                            {resolvingId === tx._id ? 'Removing...' : 'Delete Duplicate'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setIsDuplicateModalOpen(false)}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DuplicateReviewModal;
