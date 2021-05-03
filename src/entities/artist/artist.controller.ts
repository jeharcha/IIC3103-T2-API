import Koa from 'koa';
import {
  getConnection,
  getManager,
  getRepository
} from 'typeorm';
import connection from '../../database/connection';
import Router, { RouterContext } from '@koa/router';
import { Artist } from './Artist';
import albumRouter from '../album/album.controller';
import { Album } from '../album/Album';
import { Track } from '../track/Track';
import { PassThrough } from 'stream';

const routerOpts: Router.RouterOptions = {
  prefix: '/artists'
};

const artistRouter: Router = new Router(routerOpts);

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

artistRouter.get(
  '/:artist_id/albums',
  async (ctx: RouterContext) => {
    // Obtiene todos los album de un artista en particular
    var artistId = ctx.params.artist_id;
    var manager = getManager();
    var albums = await manager.find(Album, {
      artist_id: artistId
    });
    if (albums.length === 0) {
      ctx.message = 'artista no encontrado';
      console.log(
        'No se encontraron albumes del artista con ID (' +
          artistId
      );
      ctx.status = 404;
    } else {
      ctx.body = albums;
      ctx.status = 200;
      console.log(
        'Albums: \n',
        albums,
        '\nArtistId:',
        artistId
      );
    }
  }
  // Se reservar el 'return ctx.throw(404, "Not Found")' para errores.
);

artistRouter.get(
  '/:artist_id/tracks',
  async (ctx: RouterContext) => {
    // Obtiene todas las canciones de un artista en particular
    var artistId = ctx.params.artist_id;
    var manager = getManager();
    var tracks = await manager.find(Track, {
      artist_id: artistId
    });

    if (tracks === undefined) {
      ctx.message = 'artista no encontrado';
      console.log(
        'No se encontraron albumes del artista con ID (' +
          artistId
      );
      ctx.status = 404;
    } else {
      tracks.forEach(function (v) {
        delete v.artist_id;
      });
      ctx.body = tracks;
      ctx.status = 200;
      console.log(tracks);
    }
  }
);

// 2)
// GET /artists/<artist_id>/albums
artistRouter.get(
  '/:artist_id',
  async (ctx: RouterContext) => {
    var artistId = ctx.params.artist_id;
    console.log('Se entregan el artista con ID:', artistId);
    var manager = getManager();
    var artist = await manager.findOne(Artist, {
      id: artistId
    });
    if (artist === undefined) {
      ctx.message = 'artista no encontrado';
      ctx.status = 404;
    } else {
      ctx.body = artist;
      ctx.status = 200;
      console.log(
        'Artista:',
        artist.name,
        '\nId:',
        artist.id
      );
    }
  }
);

// 1)
artistRouter.get('/', async (ctx: RouterContext) => {
  console.log('Se entregan todos los artistas.');
  var manager = getManager();
  var artistas = await manager.find(Artist);
  ctx.body = artistas;
  ctx.status = 200;
  // Do something
});

artistRouter.post(
  '/:artistId/albums',
  async (ctx: RouterContext) => {
    // try {
    console.log("You've consulted this URL:\n" + ctx.URL);
    console.log('An album may be created ...');

    var artistId = ctx.params.artistId;

    // Look for the Artist, owner of this new Album
    const albumManager = getManager(); // you can also get it via getConnection().manager
    const artist = await albumManager.findOne(Artist, {
      id: artistId
    });
    if (artist === undefined) {
      //No se pudo crear este album porque no se encontró el artista padre
      ctx.status = 422;
      ctx.message = 'artista no existe';
    } else {
      //El artista si existe.
      //validaciones del body correcto para crear un Album(name, genre).
      console.log('Request Body:', ctx.request.body);
      var bodyKeysArray = Object.keys(ctx.request.body);
      var expectedKeys = ['name', 'genre'];
      var rightKeys = equals(expectedKeys, bodyKeysArray);
      if (rightKeys) {
        // Variable definitions
        const albumName = ctx.request.body.name;
        var albumGenre = ctx.request.body.genre;
        var albumIdToEncode = albumName + ':' + artistId;
        var btoa = require('btoa');
        var albumId = btoa(albumIdToEncode).substr(0, 22);
        var hostDB = process.env.URL;
        var artistURL = hostDB + 'artists/' + artistId;
        var albumTracksURL =
          hostDB + 'albums/' + albumId + '/tracks';
        var albumSelfURL = hostDB + 'albums/' + albumId;

        console.log(
          'Artist name: ' +
            artist.name +
            '\nArtistId: ' +
            artistId +
            '\nAlbum Name: ' +
            albumName
        );
        // Busca por el album en particular para ver si ya existe.
        var album = await albumManager.findOne(Album, {
          id: albumId
        });
        // Debiese revisar acá el Body del request y validar que todos  los
        // campos y sus repespectivos tipos sean correctos.
        if (album !== undefined) {
          console.log(
            'The album with the given id already exists, so it cannot be created.'
          );
          // The album with the given id already exists, so it cannot be created.
          // So the already existing album is returned into the response's body
          ctx.body = {
            id: album.id,
            artist_id: album.artist_id,
            name: album.name,
            genre: album.genre,
            artist: album.artist_url,
            tracks: album.tracks_url,
            self: album.self_url
          };
          ctx.status = 409;
          ctx.message = 'álbum ya existe';
        } else if (album === undefined) {
          // The album with the given id, does not exist, then it can be created
          var album = albumManager.create(Album, {
            id: albumId,
            artist_id: artistId,
            name: albumName,
            genre: albumGenre,
            artist_url: artistURL,
            tracks_url: albumTracksURL,
            self_url: albumSelfURL
          });
          albumManager.save(album);
          // Response.body setting
          ctx.body = {
            id: albumId,
            artist_id: artistId,
            name: albumName,
            genre: albumGenre,
            artist: artistURL,
            tracks: albumTracksURL,
            self: albumSelfURL
          };
          (ctx.status = 201),
            (ctx.message = 'album creado');
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

artistRouter.post('/', async (ctx: RouterContext) => {
  // Crear un Artist
  console.log("You've consulted this URL:", ctx.url);
  console.log('Artist may be created...');
  console.log('Request Body:', ctx.request.body);
  var bodyKeysArray = Object.keys(ctx.request.body);
  var expectedKeys = ['name', 'age'];
  var rightKeys = equals(expectedKeys, bodyKeysArray);
  if (rightKeys) {
    var artist_name = ctx.request.body.name;
    var artist_age = ctx.request.body.age;
    var btoa = require('btoa');
    var artistId = btoa(artist_name).substr(0, 22);

    var artistManager = getManager();
    var artist = await artistManager.findOne(Artist, {
      id: artistId
    });
    if (artist === undefined) {
      var hostDB = process.env.URL;
      var artistAlbumsURL =
        hostDB + 'artists/' + artistId + '/albums';
      var artistTracksURL =
        hostDB + 'artists/' + artistId + '/tracks';
      var artistSelfURL = hostDB + 'artists/' + artistId;
      var artist = artistManager.create(Artist, {
        id: artistId,
        name: artist_name,
        age: artist_age,
        albums_url: artistAlbumsURL,
        tracks_url: artistTracksURL,
        self_url: artistSelfURL
      });
      artistManager.save(artist);
      console.log(
        'You have just created a ' +
          artist.age +
          ' years old Artist called ' +
          artist.name +
          ' with ID ' +
          artistId
      );
      ctx.body = {
        id: artistId,
        name: artist_name,
        age: artist_age,
        albums: artistAlbumsURL,
        tracks: artistTracksURL,
        self: artistSelfURL
      };
      ctx.status = 201;
    } else {
      // this Artist Already exists, so it cannot be created
      console.log(
        'ERROR 409: This artist (' +
          artist_name +
          ') already exists.'
      );
      ctx.status = 409;
      ctx.message = 'artista ya existe';
      ctx.body = {
        id: artist.id,
        name: artist.name,
        age: artist.age,
        albums: artist.albums_url,
        tracks: artist.tracks_url,
        self: artist.self_url
      };
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
});

artistRouter.put(
  '/:artist_id/albums/play',
  async (ctx: RouterContext) => {
    var artistId = ctx.params.artist_id;
    var manager = getManager();
    // var track = manager.findOne(Track, {id: trackId});
    var album = manager.findOne(Artist, { id: artistId });
    if (album === undefined) {
      ctx.status = 404;
      ctx.message = 'Artista no encontrado';
    } else {
      await manager.increment(
        Track,
        { artist_id: artistId },
        'times_played',
        1
      );
      // manager.save(Track);
      var tracks = await manager.find(Track, {
        id: artistId
      });
      ctx.message =
        'todas las canciones del artista fueron reproducidas';
      console.log(
        tracks.length,
        'canciones fueron reporducidas'
      );
      ctx.status = 200;
    }
    // Play al the song of every album of the artist with id artist_id
  }
);

artistRouter.delete(
  '/:artist_id',
  async (ctx: RouterContext) => {
    // Play every song of the album with id album_id
    var artistId = ctx.params.artist_id;
    var manager = getManager();
    // var track = manager.findOne(Track, {id: trackId});
    var artist = await manager.findOne(Artist, {
      id: artistId
    });
    if (artist === undefined) {
      console.log(
        'El Artista con este ID (' +
          artistId +
          ') no existe.'
      );
      ctx.status = 404;
      ctx.message = 'artist inexistente';
    } else {
      manager.delete(Artist, { id: artistId });
      manager.delete(Album, { artist_id: artistId });
      manager.delete(Track, { artist_id: artistId });
      ctx.status = 204;
      ctx.message = 'artista eliminado';
      console.log(
        "Artista eliminado: \n  '" +
          artist.name +
          "' \nID: " +
          artist.id
      );
    } // Do something
  }
);

export default artistRouter;
