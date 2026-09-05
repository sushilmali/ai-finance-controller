import React, { useState, useEffect } from 'react';
import { X, Sparkles, Plus, Save, AlertCircle } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext.jsx';
import { apiClient } from '../../api/client.js';

const CATEGORIES = [
  'Salaries',
  'Marketing',
  'Software',
  'Travel',
  'Food',
  'Utilities',
  'Office',
  'Rent',
  'Healthcare',
  'Shopping',
  'Consulting',
  'Sales',
  'Other'
];

export const AddTransactionModal = () => {
  const {
    isAddModalOpen,
    closeAddModal,
    editingTransaction,
    refreshDashboard,
    currencySymbol
  } = useFinance();

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'Expense',
    category: 'Other',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [isCategorizing, setIsCategorizing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        description: editingTransaction.description || '',
        amount: editingTransaction.amount || '',
        type: editingTransaction.type || 'Expense',
        category: editingTransaction.category || 'Other',
        date: editingTransaction.date ? new Date(editingTransaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: editingTransaction.notes || ''
      });
    } else {
      setFormData({
        description: '',
        amount: '',
        type: 'Expense',
        category: 'Other',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
    setErrorMsg('');
  }, [editingTransaction, isAddModalOpen]);

  // Live Auto-categorization as user types description
  const handleDescriptionBlur = async () => {
    if (!formData.description.trim() || formData.category !== 'Other') return;
    setIsCategorizing(true);
    try {
      const res = await apiClient.categorizeText(formData.description, formData.type);
      if (res.category && res.category !== 'Other') {
        setFormData(prev => ({ ...prev, category: res.category }));
      }
    } catch (err) {
      console.warn('Auto-categorize failed:', err);
    } finally {
      setIsCategorizing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description.trim()) {
      setErrorMsg('Please provide a valid description.');
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      setErrorMsg('Please enter an amount greater than 0.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      if (editingTransaction?._id) {
        await apiClient.updateTransaction(editingTransaction._id, formData);
      } else {
        await apiClient.createTransaction(formData);
      }
      await refreshDashboard(false);
      closeAddModal();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save transaction');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAddModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0F172A] border border-slate-700 shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {editingTransaction ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
            <h3 className="text-base font-bold text-white font-display">
              {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
            </h3>
          </div>
          <button
            onClick={closeAddModal}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Type Toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'Expense' })}
                className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                  formData.type === 'Expense'
                    ? 'bg-rose-500/15 border-rose-500 text-rose-300 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Expense (Outflow)
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'Income' })}
                className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                  formData.type === 'Income'
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Income (Inflow)
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Description / Merchant
              </label>
              {isCategorizing && (
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 animate-pulse">
                  <Sparkles className="w-3 h-3" /> AI auto-classifying...
                </span>
              )}
            </div>
            <input
              type="text"
              required
              placeholder="e.g. Google Ads Campaign, AWS Hosting, Client Retainer"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              onBlur={handleDescriptionBlur}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>

          {/* Amount and Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Amount ({currencySymbol})
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs text-slate-400 font-bold">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs font-mono font-medium focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date and Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="Reference / invoice info"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={closeAddModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : editingTransaction ? 'Update Transaction' : 'Create Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
