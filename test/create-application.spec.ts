import 'reflect-metadata';

import { createApplication } from '../src';
import { Service } from 'typedi';
import { agent as superagent } from 'supertest';
import { Get, JsonController } from 'routing-controllers';

@Service()
@JsonController()
export class HealthController {

  @Get('/health')
  public health() {
    return { status: 'UP' };
  }
}


describe('Create Application', () => {
  let app, agent, error;

  beforeEach(() => {
    jest.clearAllMocks();
    app = createApplication({
      routePrefix: '/api/v1',
      controllers: [HealthController],
      earlyBootstrapFn: (app) => null,
    });
    agent = superagent(app);
    error = jest.spyOn(console, 'error');
  });

  test('/health endpoint responds 200', async () => {
    const response = await agent.get('/api/v1/health').send();
    expect(response.status).toEqual(200);

  });

  test('/non-existing endpoint responds 404', async () => {
    const response = await agent.get('/api/v1/non-existing').send();
    expect(response.status).toEqual(404);
    expect(response.body).toEqual({
      error: 'Could not find this route: GET /api/v1/non-existing',
      errors: [],
    });
    expect(response.header['content-type']).toEqual('application/json; charset=utf-8');
  });

  test('/non-existing endpoint responds with JSON', async () => {
    const response = await agent.get('/api/v1/non-existing').send();
    expect(response.header['content-type']).toEqual('application/json; charset=utf-8');
    expect(response.body).toEqual({
      error: 'Could not find this route: GET /api/v1/non-existing',
      errors: [],
    });
  });

  test('/non-existing endpoint logs with console.error() by default', async () => {
    const response = await agent.get('/api/v1/non-existing').send();
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenLastCalledWith(
      new Error('Could not find this route: GET /api/v1/non-existing'
    ));
  });

});
