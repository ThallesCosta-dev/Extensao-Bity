let priceChart;
const chartData = {
  labels: [],
  prices: []
};

let currentCurrency = 'BRL'; // Adicionando a variável

async function fetchBinanceHistory() {
  try {
    const currency = document.getElementById('currency').value;
    let response;
    
    // Busca o par correto baseado na moeda selecionada
    if (currency === 'BRL') {
      response = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCBRL&interval=1m&limit=30');
    } else {
      response = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=30');
    }
    
    const data = await response.json();
    
    // Limpa dados anteriores
    chartData.labels = [];
    chartData.prices = [];
    
    // Processa os dados do Binance
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
  const currency = document.getElementById('currency').value;
  
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
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#3772FF',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2
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
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          backgroundColor: '#1a2632',
          titleColor: '#6b7f95',
          bodyColor: '#fff',
          borderColor: '#2c3b4a',
          borderWidth: 1,
          padding: 10,
          displayColors: false,
          callbacks: {
            title: function(tooltipItems) {
              return tooltipItems[0].label;
            },
            label: function(context) {
              let value = context.parsed.y;
              const symbol = currency === 'BRL' ? 'R$' : '$';
              return `${symbol}${value.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true
              })}`;
            }
          }
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
              const symbol = currency === 'BRL' ? 'R$' : '$';
              return `${symbol}${value.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true
              })}`;
            },
            maxTicksLimit: 5
          }
        }
      },
      animation: false,
      onHover: (event, elements) => {
        if (elements && elements.length) {
          event.native.target.style.cursor = 'pointer';
        } else {
          event.native.target.style.cursor = 'default';
        }
      }
    }
  });
}

document.getElementById('currency').addEventListener('change', (e) => {
  const currency = e.target.value;
  chrome.storage.local.set({ currency });
  fetchBinanceHistory(); // Atualiza o gráfico ao mudar a moeda
});

function updatePriceData() {
  chrome.storage.local.get(['currentPrice', 'priceChange', 'currency'], (data) => {
    if (data.currentPrice) {
      const priceElement = document.getElementById('price');
      const changeElement = document.getElementById('price-change');
      const currencyTypeElement = document.querySelector('.currency-type');
      
      // Atualiza o tipo de moeda
      currencyTypeElement.textContent = data.currency || 'BRL';
      
      // Formata o preço com o símbolo da moeda e todas as casas decimais
      const symbol = data.currency === 'BRL' ? 'R$' : '$';
      const numericValue = parseFloat(data.currentPrice.replace(/[^0-9.-]+/g, ''));
      priceElement.textContent = `${symbol}${numericValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true
      })}`;
      
      // Atualiza a variação
      changeElement.textContent = data.priceChange;
      
      // Adiciona classes para cores da variação
      if (data.priceChange.startsWith('+')) {
        changeElement.className = 'positive';
      } else if (data.priceChange.startsWith('-')) {
        changeElement.className = 'negative';
      }
    }
  });
}

// Efeito de hover no gráfico
document.addEventListener('DOMContentLoaded', () => {
  const chartContainer = document.querySelector('.chart-container');
  
  chartContainer.addEventListener('mousemove', (e) => {
    const rect = chartContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Efeito de brilho que segue o cursor
    chartContainer.style.background = `radial-gradient(circle at ${x}px ${y}px, #3d4e5f, #2c3b4a)`;
  });
  
  chartContainer.addEventListener('mouseleave', () => {
    chartContainer.style.background = '#2c3b4a';
  });
});

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

document.getElementById('btc-amount').addEventListener('input', (e) => {
    const amount = parseFloat(e.target.value) || 0;
    chrome.storage.local.set({ bitcoinAmount: amount });
});

// Carregar valores salvos quando o popup abrir
chrome.storage.local.get(['currency', 'bitcoinAmount', 'totalValue', 'currentPrice'], (result) => {
    if (result.currency) {
        currentCurrency = result.currency;
    }
    if (result.bitcoinAmount) {
        document.getElementById('btc-amount').value = result.bitcoinAmount;
        
        // Exibir o valor total imediatamente se existir
        if (result.totalValue) {
            const totalValueElement = document.getElementById('total-value');
            const currency = currentCurrency === 'USD' ? '$' : 'R$';
            totalValueElement.innerHTML = `
                <div>Seu saldo em ${currentCurrency}</div>
                <div class="price-main">${result.bitcoinAmount} Bitcoin${result.bitcoinAmount > 1 ? 's são' : ' é'} igual a ${currency} ${result.totalValue}</div>
            `;
        }
    }
});

chrome.storage.local.onChanged.addListener((changes) => {
    if (changes.currency) {
        currentCurrency = changes.currency.newValue;
    }
    
    if (changes.totalValue || changes.bitcoinAmount) {
        const totalValueElement = document.getElementById('total-value');
        const currency = currentCurrency === 'USD' ? '$' : 'R$';
        const bitcoinAmount = document.getElementById('btc-amount').value;
        
        if (bitcoinAmount && bitcoinAmount > 0) {
            totalValueElement.innerHTML = `
                <div>Seu saldo em ${currentCurrency}</div>
                <div class="price-main">${bitcoinAmount} Bitcoin${bitcoinAmount > 1 ? 's são' : ' é'} igual a ${currency} ${changes.totalValue ? changes.totalValue.newValue : changes.totalValue}</div>
            `;
        }
    }
});