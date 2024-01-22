import express, { Application, Request } from 'express';
import { RoutingControllersOptions, useExpressServer } from 'routing-controllers';
import { HttpErrorHandler, HttpNotFoundHandler } from '.';
import { ERROR_EVENT } from './constants';
import { setupOptionsAndCors } from './cors';

interface CreateApplicationParams extends RoutingControllersOptions {
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
    ...params, // TODO: contains 2 extra parameters (earlyBootstrapFn and errorHandler), may cause issues if useExpressServer defines parameters with the same names.
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
