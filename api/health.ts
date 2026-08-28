import type { Request, Response } from 'express';

export default function handler(req: Request, res: Response) {
  return res.status(200).json({
    status: 'ok',
    time: new Date().toISOString(),
    service: 'WealthBuilder API',
    uptime: '100%',
  });
}
