import express, { Request, Response } from 'express';
import { alphaVantageRouter } from './alphavantage.ts';

const app = express();

app.use(express.json());

// Support both /api/market and /market prefixes
app.use('/api/market', alphaVantageRouter);
app.use('/market', alphaVantageRouter);

// Health check endpoints
app.get(['/api/health', '/health'], (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    service: 'WealthBuilder API',
    uptime: '100%',
  });
});

export default app;
