import Koa from 'koa';
import Router, { RouterContext } from '@koa/router';

// Ver documentación https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
// Ver documentación https://developer.mozilla.org/en-US/docs/Web/API/Request

const routerOpts: Router.RouterOptions = {
  prefix: '/albums'
};

const albumRouter: Router = new Router(routerOpts);

albumRouter.get('/', async (ctx: RouterContext) => {
  ctx.body = { name: 'jajaja\n Muy de pana' };
  // Do something
  // POST methods
  console.log('----------------');
  console.log('my_url', ctx.URL);
  console.log('My head', ctx.header);
  console.log('My_Body', ctx.body);
});

albumRouter.get(
  '/:album_id',
  async (ctx: RouterContext) => {
    ctx.body = 'GET SINGLE';
    // Do something
  }
);

albumRouter.post('/', async (ctx: RouterContext) => {
  ctx.body = 'POST';
});

albumRouter.delete(
  '/:album_id',
  async (ctx: RouterContext) => {
    ctx.body = 'DELETE';
  }
);

export default albumRouter;
