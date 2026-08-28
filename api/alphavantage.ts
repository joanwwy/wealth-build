import { Router, Request, Response } from 'express';

export const alphaVantageRouter = Router();

// In-memory cache to conserve the 25 calls/day limit
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes cache for daily stock data

// Helper to get API Key strictly from process.env inside api/ directory
function getAlphaVantageKey(): string | null {
  const key = process.env.ALPHAVANTAGE_KEY || process.env.ALPHAVANTAGE_API_KEY;
  if (!key || typeof key !== 'string' || key.trim() === '') {
    return null;
  }
  return key.trim();
}

/**
 * GET /api/market/status
 * Check if the backend AlphaVantage service is configured and ready
 */
alphaVantageRouter.get('/status', (req: Request, res: Response) => {
  const key = getAlphaVantageKey();
  if (!key) {
    return res.status(500).json({
      error: 'credential not configured',
      configured: false,
      dailyCallLimit: 25,
    });
  }

  return res.json({
    configured: true,
    provider: 'Alpha Vantage',
    dailyCallLimit: 25,
    cachedEntriesCount: cache.size,
  });
});

/**
 * GET /api/market/daily
 * Query parameters:
 *  - symbol (e.g. IBM, SPY, QQQ, AAPL) - defaults to IBM
 *  - outputsize (compact | full) - defaults to compact (100 data points)
 */
alphaVantageRouter.get('/daily', async (req: Request, res: Response) => {
  const apiKey = getAlphaVantageKey();
  if (!apiKey) {
    return res.status(500).json({ error: 'credential not configured' });
  }

  const symbol = (typeof req.query.symbol === 'string' ? req.query.symbol : 'IBM')
    .toUpperCase()
    .trim();
  const outputsize = req.query.outputsize === 'full' ? 'full' : 'compact';
  const cacheKey = `DAILY_${symbol}_${outputsize}`;

  // Return cached result if available and fresh
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return res.json({
      ...cached.data,
      fromCache: true,
      cacheAgeSeconds: Math.round((Date.now() - cached.timestamp) / 1000),
    });
  }

  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(
      symbol
    )}&outputsize=${outputsize}&apikey=${encodeURIComponent(apiKey)}`;

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({
        error: `AlphaVantage upstream error: ${response.statusText}`,
      });
    }

    const data = await response.json();

    // Check for Alpha Vantage API note/limit message
    if (data['Note']) {
      return res.status(429).json({
        error: 'Alpha Vantage rate limit reached (25 calls/day or 5 calls/min).',
        note: data['Note'],
      });
    }

    // Check for Alpha Vantage error message
    if (data['Error Message']) {
      return res.status(400).json({
        error: `Invalid symbol or parameters: ${data['Error Message']}`,
      });
    }

    const timeSeries = data['Time Series (Daily)'];
    if (!timeSeries) {
      return res.status(404).json({
        error: `No daily time series data found for symbol "${symbol}".`,
        raw: data,
      });
    }

    // Format time series data points
    const dates = Object.keys(timeSeries).sort(); // chronological order
    const points = dates.map((dateStr) => {
      const item = timeSeries[dateStr];
      return {
        date: dateStr,
        open: parseFloat(item['1. open']),
        high: parseFloat(item['2. high']),
        low: parseFloat(item['3. low']),
        close: parseFloat(item['4. close']),
        volume: parseInt(item['5. volume'], 10),
      };
    });

    const latestPoint = points[points.length - 1];
    const earliestPoint = points[0];
    const latestPrice = latestPoint ? latestPoint.close : 0;
    const earliestPrice = earliestPoint ? earliestPoint.close : 0;
    const totalChangePct =
      earliestPrice > 0 ? ((latestPrice - earliestPrice) / earliestPrice) * 100 : 0;

    // Calculate annualized volatility (standard deviation of daily log returns)
    let annualizedVolatility = 0;
    if (points.length > 2) {
      const returns: number[] = [];
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1].close;
        const curr = points[i].close;
        if (prev > 0) {
          returns.push(Math.log(curr / prev));
        }
      }
      const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
      const variance =
        returns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) / (returns.length - 1);
      annualizedVolatility = Math.sqrt(variance * 252) * 100; // Annualized %
    }

    const resultPayload = {
      meta: data['Meta Data'] || {},
      symbol,
      latestPrice,
      earliestPrice,
      totalChangePct: Number(totalChangePct.toFixed(2)),
      annualizedVolatility: Number(annualizedVolatility.toFixed(2)),
      pointsCount: points.length,
      timeSeries: points,
      lastRefreshed: data['Meta Data']?.['3. Last Refreshed'] || new Date().toISOString(),
    };

    // Store in cache
    cache.set(cacheKey, {
      data: resultPayload,
      timestamp: Date.now(),
    });

    return res.json({
      ...resultPayload,
      fromCache: false,
    });
  } catch (err: any) {
    console.error('Error fetching AlphaVantage daily data:', err);
    return res.status(500).json({
      error: 'Failed to communicate with Alpha Vantage API',
      message: err.message || String(err),
    });
  }
});

/**
 * GET /api/market/quote
 * Real-time global quote for a symbol
 */
alphaVantageRouter.get('/quote', async (req: Request, res: Response) => {
  const apiKey = getAlphaVantageKey();
  if (!apiKey) {
    return res.status(500).json({ error: 'credential not configured' });
  }

  const symbol = (typeof req.query.symbol === 'string' ? req.query.symbol : 'IBM')
    .toUpperCase()
    .trim();
  const cacheKey = `QUOTE_${symbol}`;

  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < 3 * 60 * 1000) {
    // 3 min quote cache
    return res.json({ ...cached.data, fromCache: true });
  }

  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(
      symbol
    )}&apikey=${encodeURIComponent(apiKey)}`;

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({
        error: `AlphaVantage upstream error: ${response.statusText}`,
      });
    }

    const data = await response.json();

    if (data['Note']) {
      return res.status(429).json({
        error: 'Alpha Vantage rate limit reached (25 calls/day limit).',
        note: data['Note'],
      });
    }

    const quote = data['Global Quote'];
    if (!quote || Object.keys(quote).length === 0) {
      return res.status(404).json({
        error: `No global quote found for symbol "${symbol}".`,
        raw: data,
      });
    }

    const parsedQuote = {
      symbol: quote['01. symbol'],
      open: parseFloat(quote['02. open']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      price: parseFloat(quote['05. price']),
      volume: parseInt(quote['06. volume'], 10),
      latestTradingDay: quote['07. latest trading day'],
      previousClose: parseFloat(quote['08. previous close']),
      change: parseFloat(quote['09. change']),
      changePercent: quote['10. change percent'],
    };

    cache.set(cacheKey, {
      data: parsedQuote,
      timestamp: Date.now(),
    });

    return res.json({
      ...parsedQuote,
      fromCache: false,
    });
  } catch (err: any) {
    console.error('Error fetching AlphaVantage quote:', err);
    return res.status(500).json({
      error: 'Failed to communicate with Alpha Vantage API',
      message: err.message || String(err),
    });
  }
});
