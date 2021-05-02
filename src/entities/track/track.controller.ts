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
  var manager = getManager();
  var tracks = await manager.find(Track);
  ctx.body = tracks;
  ctx.status = 200;
});

trackRouter.get(
  '/:track_id',
  async (ctx: RouterContext) => {
    var trackId = ctx.params.track_id;
    var manager = getManager();
    var track = await manager.findOne(Track, {
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
    var trackId = ctx.params.track_id;
    var manager = getManager();
    var track = await manager.findOne(Track, {
      id: trackId
    });
    if (track === undefined) {
      ctx.status = 404;
      ctx.message = 'canción no encontrada';
      console.log('ERROR 404: Not found.');
      console.log(
        'The track with ID',
        trackId,
        'was not found.'
      );
    } else {
      await manager.increment(
        Track,
        { id: trackId },
        'times_played',
        1
      );
      var track = await manager.findOne(Track, {
        id: trackId
      });
      ctx.message = 'canción reproducida';
      ctx.status = 200;
      console.log(
        'Canción:',
        track.name,
        '\n times played:',
        track.times_played
      );
    }
  }
);

trackRouter.delete(
  '/:track_id',
  async (ctx: RouterContext) => {
    ctx.body = 'DELETE';
    var trackId = ctx.params.track_id;
    var manager = getManager();
    var track = await manager.findOne(Track, {
      id: trackId
    });
    if (track === undefined) {
      console.log(
        'La canción con este ID (' + trackId + ') no existe'
      );
      ctx.message = 'canción inexistente';
      ctx.status = 404;
    } else {
      // La canción si existe y debe ser eliminada
      manager.delete(Track, { id: trackId });
      ctx.status = 204;
      ctx.message = 'canción eliminada';
      console.log(
        "Canción eliminada: \n  '" +
          track.name +
          "' \nID: " +
          track.id
      );
    }
    // Do something
  }
);

export default trackRouter;
