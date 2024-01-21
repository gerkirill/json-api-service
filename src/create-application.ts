import express, { Application, Request } from 'express';
import { useExpressServer } from 'routing-controllers';
import { HttpErrorHandler, HttpNotFoundHandler } from '.';
import { ERROR_EVENT } from './constants';
import { setupOptionsAndCors } from './cors';

interface CreateApplicationParams {
  routePrefix?: string;
  /* eslint-disable-next-line  @typescript-eslint/ban-types */
  controllers?: Function[];
  /* eslint-disable-next-line  @typescript-eslint/ban-types */
  middlewares?: Function[];
  /* eslint-disable-next-line  @typescript-eslint/ban-types */
  interceptors?: Function[];
  earlyBootstrapFn?: (app: Application) => void;
  errorHandler?: (err: Error, errorContext?: { req: Request }) => void;
}

export function createApplication(params: CreateApplicationParams): Application {
  const app = express();
  setupOptionsAndCors(app);
  // @JsonController annotation handles this as well, so not really required. But left here for "classic" controllers should they appear.
  app.use(express.json());
  params.earlyBootstrapFn && params.earlyBootstrapFn(app);
  // setup routing-controllers
  useExpressServer(app, {
    routePrefix: params.routePrefix,
    controllers: params.controllers,
    middlewares: params.middlewares,
    interceptors: params.interceptors,
    defaultErrorHandler: false,
  });
  params.errorHandler && app.on(ERROR_EVENT, (...args) => {
    const [err, errorContext] = args as any;
    params.errorHandler(err, errorContext);
  });

  app.use(HttpNotFoundHandler);
  app.use(HttpErrorHandler);
  return app;
}
