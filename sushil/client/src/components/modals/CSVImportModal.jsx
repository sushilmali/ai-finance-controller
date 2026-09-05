import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Download, CheckCircle2, AlertCircle, X, Sparkles, RefreshCw } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext.jsx';
import { apiClient } from '../../api/client.js';
import confetti from 'canvas-confetti';

export const CSVImportModal = () => {
  const { isImportModalOpen, setIsImportModalOpen, refreshDashboard } = useFinance();

  const [file, setFile] = useState(null);
  const [csvText, setCsvText] = useState('');
  const [activeTab, setActiveTab] = useState('file'); // 'file' | 'paste'
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (!selected.name.endsWith('.csv') && selected.type !== 'text/csv') {
        setErrorMsg('Please select a valid .csv file.');
        return;
      }
      setFile(selected);
      setErrorMsg('');
      setImportResult(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      if (!dropped.name.endsWith('.csv')) {
        setErrorMsg('Please drop a valid .csv file.');
        return;
      }
      setFile(dropped);
      setErrorMsg('');
      setImportResult(null);
    }
  };

  const handleImport = async () => {
    if (activeTab === 'file' && !file) {
      setErrorMsg('Please choose a CSV file to upload.');
      return;
    }
    if (activeTab === 'paste' && !csvText.trim()) {
      setErrorMsg('Please paste CSV transaction rows.');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');
    setImportResult(null);

    try {
      let res;
      if (activeTab === 'file') {
        const formData = new FormData();
        formData.append('file', file);
        res = await apiClient.importCSV(formData);
      } else {
        res = await apiClient.importCSV(csvText);
      }

      if (res.success) {
        setImportResult(res);
        // Confetti effect
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
        await refreshDashboard(false);
      }
    } catch (err) {
      setErrorMsg(err.message || 'CSV Import failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadSample = () => {
    window.open('/api/transactions/sample-csv', '_blank');
  };

  const handleClose = () => {
    setFile(null);
    setCsvText('');
    setImportResult(null);
    setErrorMsg('');
    setIsImportModalOpen(false);
  };

  if (!isImportModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0F172A] border border-slate-700 shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Import Transactions CSV
              </h3>
              <p className="text-xs text-slate-400">
                Auto-validate columns, classify categories & trigger AI anomaly scan.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="mt-4 flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('file')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'file'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'paste'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Paste CSV Data
            </button>
          </div>

          <button
            onClick={handleDownloadSample}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Sample CSV Template
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {importResult ? (
          <div className="mt-6 p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-500/40">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-white font-display">
              {importResult.message}
            </h4>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Imported</span>
                <span className="text-base font-bold text-emerald-400">{importResult.importedCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Anomalies</span>
                <span className="text-base font-bold text-rose-400">{importResult.anomaliesDetected}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Duplicates</span>
                <span className="text-base font-bold text-amber-400">{importResult.duplicatesFound}</span>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={handleClose}
                className="px-6 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
              >
                Done & View Analytics
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            {activeTab === 'file' ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-2xl p-8 text-center transition-all bg-slate-900/40 hover:bg-slate-900/70 group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv"
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-xl bg-slate-800 group-hover:bg-emerald-500/20 text-slate-400 group-hover:text-emerald-400 flex items-center justify-center mx-auto mb-3 transition-colors border border-slate-700">
                  <FileText className="w-6 h-6" />
                </div>
                {file ? (
                  <div>
                    <p className="text-xs font-bold text-white">{file.name}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                    <span className="inline-block mt-2 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      File Ready for AI Ingestion
                    </span>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-semibold text-slate-200">
                      Click to browse or drag & drop your CSV file here
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Expected columns: Date, Description, Amount, Type (Income/Expense)
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Paste Raw CSV Rows
                </label>
                <textarea
                  rows={6}
                  placeholder={`Date,Description,Amount,Type\n2026-08-01,Google Ads,15000,Expense\n2026-08-02,Client Payment,80000,Income\n2026-08-03,AWS Cloud,8500,Expense`}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImport}
                disabled={isUploading || (activeTab === 'file' && !file) || (activeTab === 'paste' && !csvText.trim())}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing & Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" /> Start AI Import
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CSVImportModal;
