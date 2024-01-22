import cors from 'cors';
import { Application } from 'express';

export function setupOptionsAndCors(app: Application): void {
  // in production - ApiGee makes CORS for us, but if we run API + SPA locally - cors() is required
  if (process.env.NODE_ENV === 'production') {
    // handle all OPTIONS requests in PROD, but expect CORS headers to be handled by the API gateway
    app.options('*', (req, res) => res.status(204).send());
  } else {
    // send cors headers only in development
    app.use(cors());
    // also handle all OPTIONS (pre-flights) requests
    app.options('*', cors());
  }
}
