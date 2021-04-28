import Koa from 'koa';
import Router, { RouterContext } from '@koa/router';

// Ver documentación https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
// Ver documentación https://developer.mozilla.org/en-US/docs/Web/API/Request

const routerOpts: Router.RouterOptions = {
  prefix: '/artists'
};

const artistRouter: Router = new Router(routerOpts);

artistRouter.get('/', async (ctx: RouterContext) => {
  ctx.body = 'GET ALL';
  console.log('Gracias haz y mati');
  // Do something
});

artistRouter.get(
  '/:artist_id/albums',
  async (ctx: RouterContext) => {
    ctx.body = 'GET SINGLE';
    const { artist_id } = ctx.params;
    ctx.status = 200;
    // Se reservar el 'return ctx.throw(404, "Not Found")' para errores.
  }
);

// GET /artists/<artist_id>/albums
artistRouter.get(
  '/:artist_id',
  async (ctx: RouterContext) => {
    ctx.body = 'GET SINGLE';
    // Do something
  }
);

artistRouter.post('/', async (ctx: RouterContext) => {
  ctx.body = 'POST';
  // Do something
});

artistRouter.delete(
  '/:artist_id',
  async (ctx: RouterContext) => {
    ctx.body = 'DELETE';
    // Do something
  }
);

export default artistRouter;
