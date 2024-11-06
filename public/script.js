document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('/api/tickers');
      const tickers = await response.json();
  
      const tableBody = document.getElementById('table-body');
      const cryptoDropdown = document.getElementById('crypto-dropdown');
  
      tickers.forEach(ticker => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${ticker.name}</td>
          <td>₹ ${ticker.last.toLocaleString()}</td>
          <td>₹ ${ticker.buy.toLocaleString()}</td>
          <td>₹ ${ticker.sell.toLocaleString()}</td>
          <td>${ticker.volume.toLocaleString()}</td>
          <td>${ticker.base_unit}</td>
        `;
        tableBody.appendChild(row);
  
        const option = document.createElement('option');
        option.value = ticker.base_unit;
        option.textContent = ticker.base_unit.toUpperCase();
        cryptoDropdown.appendChild(option);
      });
    } catch (error) {
      console.error('Error fetching tickers:', error);
    }
  
    const themeSwitch = document.getElementById('theme-switch');
    themeSwitch.addEventListener('change', () => {
      document.body.classList.toggle('light-mode');
    });
  });
  