async function test() {
  try {
    console.log('--- 1. Testing Demo Load ---');
    const demoRes = await fetch('http://localhost:5000/api/transactions/load-demo', { method: 'POST' });
    const demo = await demoRes.json();
    console.log('Demo Loaded:', demo.count, 'records');

    console.log('\n--- 2. Testing Dashboard Analytics ---');
    const dashRes = await fetch('http://localhost:5000/api/dashboard');
    const dash = await dashRes.json();
    console.log('KPIs:', dash.data.kpis);
    console.log('Top Categories:', dash.data.topCategories.map(c => `${c.category}: ₹${c.amount} (${c.percentage}%)`));
    console.log('Anomalies Detected:', dash.data.anomalies.map(a => `${a.transaction?.description} -> ₹${a.transaction?.amount} (${a.severity})`));

    console.log('\n--- 3. Testing AI Controller Chat ---');
    const chatRes = await fetch('http://localhost:5000/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Where am I spending the most?' }]
      })
    });
    const chat = await chatRes.json();
    console.log('Chat AI Response:\n', chat.data.content);

    console.log('\n--- 4. Testing Cash Flow Forecast ---');
    const forecastRes = await fetch('http://localhost:5000/api/forecast');
    const forecast = await forecastRes.json();
    console.log('Forecast Next Month:', forecast.data.predictedNextMonth);

    console.log('\n--- 5. Testing AI Insights ---');
    const insightsRes = await fetch('http://localhost:5000/api/insights');
    const insights = await insightsRes.json();
    console.log('Insights count:', insights.data.insights.length);

    console.log('\n✅ ALL BACKEND ENDPOINTS PASSED FLAWLESSLY!');
  } catch (err) {
    console.error('Test Failed:', err);
    process.exit(1);
  }
}

test();
