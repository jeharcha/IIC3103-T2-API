import Koa from 'koa';
import { getConnection, getManager } from 'typeorm';
import Router, { RouterContext } from '@koa/router';
import { Artist } from './Artist';
import albumRouter from '../album/album.controller';
import { Album } from '../album/Album';
import { PassThrough } from 'stream';

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
      //Retornar error 422 (Unprocessable Entity)
      ctx.status = 422;
      ctx.message = 'artista no existe';
    } else {
      //El artista si existe.
      // Variable definitions
      var albumName = ctx.request.body.name;
      var albumGenre = ctx.request.body.genre;
      var albumIdToEncode = albumName + ':' + artistId;
      var btoa = require('btoa');
      var albumId = btoa(albumIdToEncode).substr(0, 22);
      var hostDB = process.env.URL;
      var artistURL = hostDB + '/artists/' + artistId;
      var albumTracksURL =
        hostDB + '/albums/' + albumId + '/tracks';
      var albumSelfURL = hostDB + '/albums/' + albumId;

      console.log(
        'Artist name: ' +
          artist.name +
          '\nArtistId: ' +
          artistId
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
        (ctx.status = 201), (ctx.message = 'album creado');
      }
    }
    // } catch (e) {
    //   ctx.status = 400;
    //   ctx.message = 'inválido';
    // } finally {
    //   }
  }
);

artistRouter.post('/', async (ctx: RouterContext) => {
  // Crear un Artist
  console.log('Rout:' + routerOpts.prefix + '/');
  console.log('Artist is about to be created ...');
  var artist_name = ctx.request.body.name;
  var artist_age = ctx.request.body.age;
  var btoa = require('btoa');
  var artistId = btoa(artist_name).substr(0, 22);
  var hostDB = process.env.URL;
  var artistAlbumsURL =
    hostDB + '/artists/' + artistId + '/albums';
  var artistTracksURL =
    hostDB + '/artists/' + artistId + '/tracks';
  var artistSelfURL = hostDB + '/artists/' + artistId;

  const artistManager = getManager(); // you can also get it via getConnection().manager
  const artist = artistManager.create(Artist, {
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
