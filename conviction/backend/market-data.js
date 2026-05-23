import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 30 }); // 30 second cache

async function fetchBinanceFundingRates(symbol = 'BTCUSDT') {
  try {
    const response = await axios.get('https://fapi.binance.com/fapi/v1/fundingInfo', {
      params: { symbol }
    });
    const data = response.data[0];
    return {
      rate: data.lastFundingRate,
      nextFundingTime: data.nextFundingTime,
      ratePercent: (parseFloat(data.lastFundingRate) * 100).toFixed(4)
    };
  } catch (error) {
    console.error('Binance funding rate error:', error.message);
    return { rate: 'unavailable', ratePercent: 'unavailable' };
  }
}

async function fetchCoinGeckoData(coin = 'bitcoin') {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price`,
      {
        params: {
          ids: coin,
          vs_currencies: 'usd',
          include_market_cap: true,
          include_24hr_vol: true,
          include_24hr_change: true
        }
      }
    );
    const data = response.data[coin];
    return {
      price: data.usd,
      marketCap: data.usd_market_cap,
      volume24h: data.usd_24h_vol,
      change24h: data.usd_24h_change
    };
  } catch (error) {
    console.error('CoinGecko error:', error.message);
    return null;
  }
}

async function fetchFearGreedIndex() {
  try {
    const response = await axios.get('https://api.alternative.me/fng/');
    const data = response.data.data[0];
    return {
      value: data.value,
      classification: data.value_classification
    };
  } catch (error) {
    console.error('Fear & Greed error:', error.message);
    return { value: 'N/A', classification: 'Unknown' };
  }
}

async function fetchRSI(symbol = 'btc') {
  // Simplified RSI calculation using 24h change as proxy
  // Real implementation would fetch historical prices
  const geckoData = await fetchCoinGeckoData(symbol === 'btc' ? 'bitcoin' : 'ethereum');
  if (!geckoData) return 50;
  
  const change = geckoData.change24h;
  // Map -20% to +20% change to RSI 0-100
  let rsi = 50 + (change / 20) * 50;
  rsi = Math.min(100, Math.max(0, rsi));
  return Math.round(rsi);
}

export {
  fetchBinanceFundingRates,
  fetchCoinGeckoData,
  fetchFearGreedIndex,
  fetchRSI
};