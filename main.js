// Get HTML elements
const amountInput = document.getElementById('amount');
const fromSelect = document.getElementById('fromCurrency');
const toSelect = document.getElementById('toCurrency');
const swapBtn = document.getElementById('swapBtn');
const resultDiv = document.getElementById('result');
const loader = document.getElementById('loader');

// List of currencies
const currencies = [
    { code: 'USD', name: 'US Dollar', icon: '🇺🇸' },
    { code: 'EUR', name: 'Euro', icon: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', icon: '🇬🇧' },
    { code: 'INR', name: 'Indian Rupee', icon: '🇮🇳' },
    { code: 'JPY', name: 'Japanese Yen', icon: '🇯🇵' },
    { code: 'AUD', name: 'Australian Dollar', icon: '🇦🇺' },
    { code: 'CAD', name: 'Canadian Dollar', icon: '🇨🇦' },
    { code: 'CHF', name: 'Swiss Franc', icon: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', icon: '🇨🇳' }
];

// Fill currency dropdowns
let optionsHTML = '';
currencies.forEach(currency => {
    optionsHTML += `<option value="${currency.code}">${currency.icon} ${currency.code} - ${currency.name}</option>`;
});
fromSelect.innerHTML = optionsHTML;
toSelect.innerHTML = optionsHTML;

// Set defaults
fromSelect.value = 'USD';
toSelect.value = 'INR';

// Convert currencies
async function convert() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromSelect.value;
    const toCurrency = toSelect.value;

    // Show loading
    loader.style.display = 'block';
    resultDiv.style.opacity = '0.5';

    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        if (!response.ok) throw new Error('Connection error');
        
        const data = await response.json();
        const rate = data.rates[toCurrency];
        const convertedAmount = (amount * rate).toFixed(2);
        
        const fromCurrencyObj = currencies.find(c => c.code === fromCurrency);
        const toCurrencyObj = currencies.find(c => c.code === toCurrency);
        
        resultDiv.innerHTML = `
            <div>${fromCurrencyObj.icon} ${amount.toFixed(2)} ${fromCurrency} = ${toCurrencyObj.icon} ${convertedAmount} ${toCurrency}</div>
            <div style="font-size: 0.9rem; margin-top: 8px; color: #7f8c8d;">1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}</div>
        `;
        resultDiv.style.color = '#2c3e50';
    } catch (error) {
        resultDiv.textContent = 'Error: Could not connect to the exchange rate service. Please try again later.';
        resultDiv.style.color = '#e74c3c';
    } finally {
        loader.style.display = 'none';
        resultDiv.style.opacity = '1';
    }
}

// Swap currencies
function swap() {
    [fromSelect.value, toSelect.value] = [toSelect.value, fromSelect.value];
    convert();
}

// Event listeners
amountInput.addEventListener('input', () => setTimeout(convert, 500));
fromSelect.addEventListener('change', convert);
toSelect.addEventListener('change', convert);
swapBtn.addEventListener('click', swap);

// Initial conversion
document.addEventListener('DOMContentLoaded', () => {
    if (amountInput.value) convert();
});