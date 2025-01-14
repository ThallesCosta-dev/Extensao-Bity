let priceChart;
const chartData = {
  labels: [],
  prices: []
};

async function fetchBinanceHistory() {
  try {
    const response = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=30');
    const data = await response.json();
    
    // Limpa dados anteriores
    chartData.labels = [];
    chartData.prices = [];
    
    // Processa os dados do Binance (cada item é um array com [timestamp, open, high, low, close, ...])
    data.forEach(candle => {
      const time = new Date(candle[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const price = parseFloat(candle[4]); // usando o preço de fechamento
      chartData.labels.push(time);
      chartData.prices.push(price);
    });
    
    updateChart();
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
  }
}

function updateChart() {
  const ctx = document.getElementById('priceChart').getContext('2d');
  
  if (priceChart) {
    priceChart.destroy();
  }

  priceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.labels,
      datasets: [{
        data: chartData.prices,
        borderColor: '#3772FF',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 10,
          bottom: 0
        }
      },
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          grid: {
            color: '#2c3b4a',
            drawBorder: false
          },
          ticks: {
            color: '#6b7f95',
            maxRotation: 0,
            maxTicksLimit: 6
          }
        },
        y: {
          grid: {
            color: '#2c3b4a',
            drawBorder: false
          },
          ticks: {
            color: '#6b7f95',
            callback: function(value) {
              return value >= 1000 ? `${(value/1000).toFixed(1)}k` : value;
            },
            maxTicksLimit: 5
          }
        }
      },
      animation: false
    }
  });
}

document.getElementById('currency').addEventListener('change', (e) => {
  const currency = e.target.value;
  chrome.storage.local.set({ currency });
  fetchBinanceHistory(); // Atualiza o gráfico ao mudar a moeda
});

function updatePriceData() {
  chrome.storage.local.get(['currentPrice', 'priceChange'], (data) => {
    if (data.currentPrice) {
      document.getElementById('price').textContent = data.currentPrice;
      document.getElementById('price-change').textContent = data.priceChange;
    }
  });
}

// Inicialização
chrome.storage.local.get('currency', (data) => {
  if (data.currency) {
    document.getElementById('currency').value = data.currency;
  }
  fetchBinanceHistory();
});

updatePriceData();
setInterval(() => {
  updatePriceData();
  fetchBinanceHistory();
}, 10000);