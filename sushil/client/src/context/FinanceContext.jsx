import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client.js';
import confetti from 'canvas-confetti';

const FinanceContext = createContext(null);

export const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£'
};

export const FinanceProvider = ({ children }) => {
  const [currency, setCurrency] = useState('INR');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Currency Formatter
  const formatCurrency = useCallback((amount, showSymbol = true) => {
    if (amount === undefined || amount === null || isNaN(amount)) return `${showSymbol ? CURRENCY_SYMBOLS[currency] : ''}0`;
    const formatted = Math.abs(amount).toLocaleString('en-IN');
    const symbol = showSymbol ? CURRENCY_SYMBOLS[currency] : '';
    return amount < 0 ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
  }, [currency]);

  // Fetch Dashboard
  const refreshDashboard = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      setError(null);
      const res = await apiClient.getDashboard();
      if (res.success) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Error refreshing dashboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshDashboard(true);
  }, [refreshDashboard]);

  // Load Demo Data Handler
  const handleLoadDemoData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.loadDemoData();
      if (res.success) {
        // Fire celebration confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        await refreshDashboard(false);
        return { success: true, message: res.message };
      }
    } catch (err) {
      console.error('Demo data error:', err);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Reset Data Handler
  const handleResetData = async () => {
    try {
      setLoading(true);
      await apiClient.resetData();
      await refreshDashboard(false);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = (transactionToEdit = null) => {
    setEditingTransaction(transactionToEdit);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setEditingTransaction(null);
    setIsAddModalOpen(false);
  };

  return (
    <FinanceContext.Provider
      value={{
        currency,
        setCurrency,
        currencySymbol: CURRENCY_SYMBOLS[currency],
        formatCurrency,
        dashboardData,
        loading,
        error,
        refreshDashboard,
        handleLoadDemoData,
        handleResetData,
        isAddModalOpen,
        openAddModal,
        closeAddModal,
        editingTransaction,
        isImportModalOpen,
        setIsImportModalOpen,
        isDuplicateModalOpen,
        setIsDuplicateModalOpen
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
