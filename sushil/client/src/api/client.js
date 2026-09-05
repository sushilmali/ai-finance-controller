const API_BASE = '/api';

export const apiClient = {
  async getDashboard() {
    const res = await fetch(`${API_BASE}/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch dashboard data');
    return res.json();
  },

  async getTransactions(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const res = await fetch(`${API_BASE}/transactions?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
  },

  async createTransaction(data) {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to create transaction' }));
      throw new Error(err.message || 'Failed to create transaction');
    }
    return res.json();
  },

  async updateTransaction(id, data) {
    const res = await fetch(`${API_BASE}/transactions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update transaction');
    return res.json();
  },

  async deleteTransaction(id) {
    const res = await fetch(`${API_BASE}/transactions/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete transaction');
    return res.json();
  },

  async importCSV(formDataOrData) {
    let res;
    if (formDataOrData instanceof FormData) {
      res = await fetch(`${API_BASE}/transactions/import`, {
        method: 'POST',
        body: formDataOrData
      });
    } else {
      res = await fetch(`${API_BASE}/transactions/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvData: formDataOrData })
      });
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to import CSV' }));
      throw new Error(err.message || 'Failed to import CSV');
    }
    return res.json();
  },

  async loadDemoData() {
    const res = await fetch(`${API_BASE}/transactions/load-demo`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to load demo data');
    return res.json();
  },

  async resetData() {
    const res = await fetch(`${API_BASE}/transactions/reset`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to reset transactions');
    return res.json();
  },

  async getInsights() {
    const res = await fetch(`${API_BASE}/insights`);
    if (!res.ok) throw new Error('Failed to fetch insights');
    return res.json();
  },

  async getAnomalies(severity = 'All') {
    const res = await fetch(`${API_BASE}/anomalies?severity=${encodeURIComponent(severity)}`);
    if (!res.ok) throw new Error('Failed to fetch anomalies');
    return res.json();
  },

  async updateAnomalyStatus(id, status) {
    const res = await fetch(`${API_BASE}/anomalies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update anomaly status');
    return res.json();
  },

  async scanAnomalies() {
    const res = await fetch(`${API_BASE}/anomalies/scan`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to scan anomalies');
    return res.json();
  },

  async getForecast() {
    const res = await fetch(`${API_BASE}/forecast`);
    if (!res.ok) throw new Error('Failed to fetch forecast');
    return res.json();
  },

  async sendChatMessage(messages) {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages })
    });
    if (!res.ok) throw new Error('AI Controller failed to respond');
    return res.json();
  },

  async categorizeText(description, type = 'Expense') {
    const res = await fetch(`${API_BASE}/ai/categorize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, type })
    });
    if (!res.ok) return { category: 'Other' };
    return res.json();
  }
};
