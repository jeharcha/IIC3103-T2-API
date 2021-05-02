import Koa from 'koa';
import { getConnection, getManager } from 'typeorm';
import Router, { RouterContext } from '@koa/router';
import { Transform } from 'stream';
import { Track } from './Track';
import { Artist } from '../artist/Artist';
import { Album } from '../album/Album';

// Ver documentación https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
// Ver documentación https://developer.mozilla.org/en-US/docs/Web/API/Request

const routerOpts: Router.RouterOptions = {
  prefix: '/tracks'
};

const trackRouter: Router = new Router(routerOpts);

trackRouter.get('/', async (ctx: RouterContext) => {
  console.log('Se entregan todos las tracks.');
  const manager = getManager();
  const tracks = await manager.find(Track);
  ctx.body = tracks;
  ctx.status = 200;
});

trackRouter.get(
  '/:track_id',
  async (ctx: RouterContext) => {
    const trackId = ctx.params.track_id;
    const manager = getManager();
    const track = await manager.findOne(Track, {
      id: trackId
    });
    if (track === undefined) {
      ctx.message = 'canción no encontrada';
      console.log(
        'La canción con este ID (' +
          trackId +
          ') no existe.'
      );
      ctx.status = 404;
    } else {
      ctx.body = track;
      ctx.status = 200;
      console.log('Track:', track.name, '\nId:', track.id);
    }
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
