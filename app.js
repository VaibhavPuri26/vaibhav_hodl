const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
require('./db/config');
const Doc = require('./db/doc');

const app = express();
const port = 3000;

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));
app.use(cors()); // Enable CORS if accessing from different origins

// Fetch data from WazirX and save it in the database
async function fetchAndSaveTickerData() {
  try {
    await Doc.deleteMany({}); // Clear existing data
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const tickers = response.data;

    const topTenTickers = Object.entries(tickers)
      .slice(0, 10)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    const tickerArray = Object.keys(topTenTickers).map(key => {
      return { name: key, ...topTenTickers[key] };
    });

    for (const ticker of tickerArray) {
      const { name, last, buy, sell, volume, base_unit } = ticker;
      const doc = new Doc({ name, last, buy, sell, volume, base_unit });
      await doc.save();
    }
  } catch (error) {
    console.error('Error fetching data from WazirX API:', error.message);
  }
}

// API endpoint to serve ticker data as JSON
app.get('/api/ticker', async (req, res) => {
  try {
    const allData = await Doc.find({});
    res.json(allData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Serve the static HTML file for the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Fetch and save data on server start
fetchAndSaveTickerData();

// Refresh data every 5 minutes (300000 milliseconds)
setInterval(fetchAndSaveTickerData, 300000);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
