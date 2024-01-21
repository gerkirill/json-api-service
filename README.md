# `api-service`

A library to simplify web API service creation. It relies on express and [routing-controllers](https://github.com/typestack/routing-controllers#example-of-usage).

The library reduces a boilerplate to spin-up a rest API service. Also this library:

- Sets up HEAD request handler (HEAD requests appear as a part of CORS workflow).
- Handlers CORS but only in development (local) mode.
- Handles HTTP errors and responds with proper JSON and HTTP status code.

## Usage

Install library and required peer dependencies:

```bash
npm i @gerkirill/api-service routing-controllers@^0.9.0 class-transformer@^0.3.1 class-validator@^0.12.2 
npm i -D @types/node
```

Note: versions of class-transformer and class-validator are defined as peer dependencies of the routing-controllers^0.9.0.

Usage example:

```typescript
import { createApplication } from '@gerkirill/api-service';
import { Get, JsonController } from 'routing-controllers';

const BASE_PATH = '/api';
const PORT = 5000;

@JsonController()
class HealthController {
  // http://localhost:5000/api/health/
  @Get('/health') 
  public async getHealth() {
    return { status: 'ok' };
  }
}

const app = createApplication({
  routePrefix: BASE_PATH,
  controllers: [HealthController],
  errorHandler: (error) => console.error(error),
});
app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
```

Also, make sure the following `compilerOptions` are set in your `tsconfig.json`:

```json
{
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true
}
```

*createApplication* accepts configuration object with the following fields:

- *routePrefix* _(optional, string)_ A url fragment to be added to all controllers, e.g.: `/api/v1/alert`.
- *controllers* _(array)_ Array of controller classes annotated with `@Controller()` or `@JsonController()`.
- *middlewares* _(optional, array)_ Array of [middleware](https://github.com/typestack/routing-controllers#using-middlewares) classes to use globally.
- *interceptors* _(optional, array)_ Array of [interceptors](https://github.com/typestack/routing-controllers#using-interceptors) to use globally, annotated with `@Interceptor()`.
- *earlyBootstrapFn* _(optional, function(app) => void)_ Function to execute on app before it is passed to [useExpressServer()](https://github.com/typestack/routing-controllers#pre-configure-expresskoa).
- *errorHandler* _(optional, function(err) => void)_ A callback invoked by the custom HTTP error handler this library provides. If error handler is not set - errors are logged to console with `console.error()`.


## Contributing

Upon update of `routing-controllers` - make sure to update peer dependency versions in package.json (dev dependencies section) and in README. Also, you may get a warning like this one `class-transformer 0.3.2 (0.5.1 is available) deprecated` - please don't upgrade unless your version of `routing-controllers` requires exactly this version.
