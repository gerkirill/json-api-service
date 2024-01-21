import cors from 'cors';
import { Application } from 'express';

export function setupOptionsAndCors(app: Application): void {
  // in production - ApiGee makes CORS for us, but if we run API + SPA locally - cors() is required
  if (process.env.NODE_ENV === 'production') {
    // handle all OPTIONS requests also prod., but w/o Cors headers
    app.options('*', (req, res) => res.status(204).send());
  } else {
    // send cors headers only in development
    app.use(cors());
    app.options('*', cors());
  }
}
