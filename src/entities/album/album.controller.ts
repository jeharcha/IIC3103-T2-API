import Koa from 'koa';
import { getConnection, getManager } from 'typeorm';
import Router, { RouterContext } from '@koa/router';
import { Album } from './Album';
import { Artist } from '../artist/Artist';
import { Track } from '../track/Track';
import trackRouter from '../track/track.controller';
// import { equals } from '../../database/equals';

// Ver documentación https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
// Ver documentación https://developer.mozilla.org/en-US/docs/Web/API/Request

const routerOpts: Router.RouterOptions = {
  prefix: '/albums'
};

var albumRouter: Router = new Router(routerOpts);

function equals(array1, array2) {
  // code to be executed
  // if the other array is a falsy value, return
  if (!array2) return false;

  // compare lengths - can save a lot of time
  if (array1.length != array2.length) return false;

  for (var i = 0, l = array1.length; i < l; i++) {
    // Check if we have nested arrays
    if (
      array1[i] instanceof Array &&
      array2[i] instanceof Array
    ) {
      // recurse into the nested arrays
      if (equals(!array1[i], array2[i])) return false;
    } else if (array1[i] != array2[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
}

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
      //Validar que el body sea correcto
      console.log('Request Body:', ctx.request.body);
      var bodyKeysArray = Object.keys(ctx.request.body);
      var expectedKeys = ['name', 'duration'];
      var rightKeys = equals(expectedKeys, bodyKeysArray);
      if (rightKeys) {
        var rightValues = equals(
          expectedKeys,
          bodyKeysArray
        );
        var bodyValuesArray = Object.values(
          ctx.request.body
        );
        var expectedValuesTypes = ['string', 'number'];
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
        var trackArtist = await trackManager.findOne(
          Artist,
          {
            id: artistId
          }
        );
        console.log('Artist name:', trackArtist.name);
        var trackArtistURL =
          hostDB + 'artists/' + trackArtist.id;
        var trackAlbumURL = hostDB + 'albums/' + albumId;
        var trackSelfURL = hostDB + 'tracks/' + trackId;
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
            // id: albumId,
            // album_id: albumId,
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
      } else {
        console.log('ERROR 400: Bad Request');
        console.log(
          'Los campos correctos son: \n',
          expectedKeys
        );
        ctx.status = 400;
        ctx.message = 'Bad Request';
      }
    }
  }
);

albumRouter.get(
  '/:album_id/tracks',
  async (ctx: RouterContext) => {
    // Retorna todas las canciones de un album en particular
    var albumId = ctx.params.album_id;
    var manager = getManager();
    var album = await manager.findOne(Album, {
      id: albumId
    });
    if (album === undefined) {
      // Thsis album does not exist, so the query cannot be processed
      console.log(
        'ERROR 404: Album NOT FOUND \nYou looked for the ID: ' +
          albumId
      );
      ctx.status = 404;
      ctx.message = 'álbum no encontrado';
    } else {
      ctx.message = 'resutados obtenidos';
      var tracks = await manager.find(Track, {
        album_id: albumId
      });
      tracks.forEach(function (v) {
        delete v.artist_id;
      });
      ctx.body = tracks;
    }
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
