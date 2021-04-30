import Koa from 'koa';
import { getConnection } from 'typeorm';
import Router, { RouterContext } from '@koa/router';

// Ver documentación https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
// Ver documentación https://developer.mozilla.org/en-US/docs/Web/API/Request

const routerOpts: Router.RouterOptions = {
  prefix: '/tracks'
};

const trackRouter: Router = new Router(routerOpts);

trackRouter.get('', async (ctx: RouterContext) => {
  ctx.body = 'GET ALL TRACKS';
  // Do something
});

trackRouter.get(
  '/:track_id',
  async (ctx: RouterContext) => {
    ctx.body = 'GET SINGLE';
    // Do something
  }
);

trackRouter.put(
  '/:track_id/play',
  async (ctx: RouterContext) => {
    // Play the song with id track_id
  }
);

trackRouter.delete(
  '/:track_id',
  async (ctx: RouterContext) => {
    ctx.body = 'DELETE';
    // Do something
  }
);

export default trackRouter;
