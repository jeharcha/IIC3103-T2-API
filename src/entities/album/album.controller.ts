import Koa from 'koa';
import { getConnection, getManager } from 'typeorm';
import Router, { RouterContext } from '@koa/router';
import { Album } from './Album';
import { Artist } from '../artist/Artist';
import { Track } from '../track/Track';

// Ver documentación https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
// Ver documentación https://developer.mozilla.org/en-US/docs/Web/API/Request

const routerOpts: Router.RouterOptions = {
  prefix: '/albums'
};

var albumRouter: Router = new Router(routerOpts);

albumRouter.post(
  '/:albumId/tracks',
  async (ctx: RouterContext) => {
    console.log("You've consulted this URL:\n" + ctx.URL);
    console.log('A Song may be created ...');

    // Validar que el album del que se quiere crear la canción, existe
    var trackManager = getManager();
    // Validar que existe este album en particular
    var albumId = ctx.params.albumId;
    var album = await trackManager.findOne(Album, {
      id: albumId
    });
    if (album === undefined) {
      //No se pudo crear este album porque no se encontró el artista padre
      //Retornar error 422 (Unprocessable Entity)
      ctx.status = 422;
      ctx.message = 'álbum no existe';
    } else {
      // This album actually exists, then it does have an Artist
      // Variable definitions
      var trackName = ctx.request.body.name;
      var trackDuration = ctx.request.body.duration;
      var trackIdToEncode = trackName + ':' + albumId;
      var btoa = require('btoa');
      var trackId = btoa(trackIdToEncode).substr(0, 22);
      var hostDB = process.env.URL;
      console.log('Álbum encontrado:', album.name);
      console.log(
        '----- Justo antes de llamar al Artista -'
      );
      var artistId = album.artist_id;
      var trackArtist = await trackManager.findOne(Artist, {
        id: artistId
      });
      console.log('Artist name:', trackArtist.name);
      var trackArtistURL =
        hostDB + '/artists/' + trackArtist.id;
      var trackAlbumURL = hostDB + '/albums/' + albumId;
      var trackSelfURL = hostDB + '/tracks/' + trackId;
      // Ahora debemos validar que esta canción en particular no existe
      var track = await trackManager.findOne(Track, {
        id: trackId
      });
      if (track === undefined) {
        // This track does not exists so it can be created
        var track = trackManager.create(Track, {
          id: trackId,
          album_id: albumId,
          artist_id: artistId,
          name: trackName,
          duration: trackDuration,
          times_played: 0,
          artist_url: trackArtistURL,
          album_url: trackAlbumURL,
          self_url: trackSelfURL
        });
        trackManager.save(track);
        ctx.body = {
          id: albumId,
          album_id: albumId,
          name: trackName,
          duration: trackDuration,
          times_played: 0,
          artist: trackArtistURL,
          album: trackAlbumURL,
          self: trackSelfURL
        };
        (ctx.status = 201),
          (ctx.message = 'canción creada');
      } else {
        // This track already exists
        console.log(
          'The track with the given name already exists in this album, so it cannot be created.'
        );
        // The album with the given id already exists, so it cannot be created.
        // So the already existing album is returned into the response's body
        ctx.body = {
          id: track.id,
          album_id: track.album_id,
          name: track.name,
          duration: track.duration,
          times_played: track.times_played,
          artist: track.artist_url,
          album: track.album_url,
          self: track.self_url
        };
        ctx.status = 409;
        ctx.message = 'canción ya existe';
      }
    }
  }
);

albumRouter.get(
  '/:album_id/tracks',
  async (ctx: RouterContext) => {
    ctx.body = 'GET SINGLE';
    // Do something
  }
);

albumRouter.get(
  '/:album_id',
  async (ctx: RouterContext) => {
    var albumId = ctx.params.album_id;
    var manager = getManager();
    var album = await manager.findOne(Album, {
      id: albumId
    });
    if (album === undefined) {
      ctx.message = 'álbum no encontrado';
      console.log(
        'El álbun con este ID (' + albumId + ') no existe.'
      );
      ctx.status = 404;
    } else {
      ctx.body = album;
      ctx.status = 200;
      console.log('Álbum:', album.name, '\nId:', album.id);
    }
  }
);

albumRouter.get('/', async (ctx: RouterContext) => {
  // console.log('my_url', ctx.URL);
  // console.log('My head', ctx.header);
  // console.log('My_Body', ctx.body);
  console.log('Se entregan todos los Albums.');
  var manager = getManager();
  var albums = await manager.find(Album);
  ctx.body = albums;
  ctx.status = 200;
  // Do something
});

albumRouter.put(
  '/:album_id/tracks/play',
  async (ctx: RouterContext) => {
    // Play every song of the album with id album_id
    var albumId = ctx.params.album_id;
    var manager = getManager();
    // var track = manager.findOne(Track, {id: trackId});
    var album = await manager.findOne(Album, {
      id: albumId
    });
    if (album === undefined) {
      ctx.status = 404;
      ctx.message = 'álbum no encontrado';
    } else {
      await manager.increment(
        Track,
        { album_id: albumId },
        'times_played',
        1
      );
      // manager.save(Track);
      var tracks = await manager.find(Track, {
        id: albumId
      });
      ctx.message = 'canciones del álbum reproducidas';
      console.log('Canciones reproducidas:', tracks);
      ctx.status = 200;
    }
  }
);

albumRouter.delete(
  '/:album_id',
  async (ctx: RouterContext) => {
    var albumId = ctx.params.album_id;
    var manager = getManager();
    var album = await manager.findOne(Album, {
      id: albumId
    });
    if (album === undefined) {
      console.log(
        'El album con este ID (' + albumId + ') no existe.'
      );
      ctx.message = 'album no encontrado';
      ctx.status = 404;
    } else {
      // La canción si existe y debe ser eliminada
      manager.delete(Album, { id: albumId });
      manager.delete(Track, { album_id: albumId });
      ctx.status = 204;
      ctx.message = 'álbum eliminado';
      console.log(
        "Álbum eliminado: \n  '" +
          album.name +
          "' \nID: " +
          album.id
      );
    }
  }
);

export default albumRouter;
