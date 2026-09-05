import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Navbar from './components/layout/Navbar.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import TransactionsPage from './pages/TransactionsPage.jsx';
import InsightsPage from './pages/InsightsPage.jsx';
import AnomaliesPage from './pages/AnomaliesPage.jsx';
import ForecastPage from './pages/ForecastPage.jsx';
import ControllerChatPage from './pages/ControllerChatPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import AddTransactionModal from './components/modals/AddTransactionModal.jsx';
import CSVImportModal from './components/modals/CSVImportModal.jsx';

export const AppContent = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col font-sans">
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        closeMobileSidebar={() => setIsMobileSidebarOpen(false)}
      />

      <div className="lg:pl-64 flex flex-col flex-1">
        <Navbar openMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/anomalies" element={<AnomaliesPage />} />
            <Route path="/forecast" element={<ForecastPage />} />
            <Route path="/controller" element={<ControllerChatPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Modals */}
      <AddTransactionModal />
      <CSVImportModal />
    </div>
  );
};

export function App() {
  return (
    <Router>
      <FinanceProvider>
        <AppContent />
      </FinanceProvider>
    </Router>
  );
}

export default App;
