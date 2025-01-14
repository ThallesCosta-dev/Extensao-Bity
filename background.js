let currentPrice = '';
let currentCurrency = 'BRL';
let previousPrice = null;

function formatCompactNumber(number) {
    number = Math.round(number);
    if (number >= 1000) {
        if (number < 100000) {
            return (number/1000).toFixed(1) + 'k';
        }
        return Math.floor(number/1000) + 'k';
    }
    return number.toString();
}

function calculatePriceChange(currentPrice, previousPrice) {
    if (!previousPrice) return '+0.00%';
    const change = ((currentPrice - previousPrice) / previousPrice) * 100;
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
}

async function fetchPrice() {
    try {
        // Busca BTC-BRL
        const btcResponse = await fetch('https://api.bitpreco.com/btc-brl/ticker');
        const btcData = await btcResponse.json();
        
        let price = Number(btcData.last);
        
        // Se for USD, converte usando USDT-BRL
        if (currentCurrency === 'USD') {
            const usdtResponse = await fetch('https://api.bitpreco.com/usdt-brl/ticker');
            const usdtData = await usdtResponse.json();
            const usdtPrice = Number(usdtData.last);
            price = price / usdtPrice;
        }
        
        // Não formata com K, mantém o valor completo
        currentPrice = price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true
        });
        
        chrome.action.setBadgeText({ text: formatCompactNumber(price) }); // Mantém o badge compacto
        chrome.action.setBadgeBackgroundColor({ color: '#000' });
        
        const priceChange = calculatePriceChange(price, previousPrice);
        previousPrice = price;
        
        chrome.storage.local.set({
            currentPrice,
            priceChange,
            timestamp: Date.now()
        });
        
        setTimeout(fetchPrice, 10000);
    } catch (error) {
        console.error('Erro ao buscar preço:', error);
        setTimeout(fetchPrice, 10000);
    }
}

chrome.storage.onChanged.addListener((changes) => {
    if (changes.currency) {
        currentCurrency = changes.currency.newValue;
        previousPrice = null;
        fetchPrice();
    }
});

fetchPrice(); 