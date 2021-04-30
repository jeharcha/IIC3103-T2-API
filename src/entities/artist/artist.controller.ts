import Koa from 'koa';
import { getConnection, getManager } from 'typeorm';
import Router, { RouterContext } from '@koa/router';
import { Artist } from './Artist';

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

artistRouter.get(
  '/:artist_id/tracks',
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
  // Crear un Artist
  console.log('Si llego a la rutas HAZ');
  var artist_name = ctx.request.body.name;
  var artist_age = ctx.request.body.age;
  var btoa = require('btoa');
  var artist_id = btoa(artist_name).substr(0, 22);
  var host_db = process.env.URL;
  var artist_albums =
    host_db + '/artists/' + artist_id + '/albums';
  var artist_tracks =
    host_db + '/artists/' + artist_id + '/tracks';
  var artist_self = host_db + '/artists/' + artist_id;

  const artistManager = getManager(); // you can also get it via getConnection().manager
  const artist = artistManager.create(Artist, {
    id: artist_id,
    name: artist_name,
    age: artist_age
  });

  // await getConnection()
  //   .createQueryBuilder()
  //   .insert()
  //   .into(Artist)
  //   .values([
  //     {
  //       id: artist_id,
  //       name: artist_name,
  //       age: artist_age
  //     }
  //   ])
  //   .execute();
  ctx.response.body = {
    id: artist_id,
    name: artist_name,
    age: artist_age,
    albums: artist_albums,
    tracks: artist_tracks,
    self: artist_self
  };
  ctx.response.status = 200;
  // Do something
});

artistRouter.put(
  '/:artist_id/albums/play',
  async (ctx: RouterContext) => {
    // Play al the song of every album of the artist with id artist_id
  }
);

artistRouter.delete(
  '/:artist_id',
  async (ctx: RouterContext) => {
    ctx.body = 'DELETE';
    // Do something
  }
);

export default artistRouter;
