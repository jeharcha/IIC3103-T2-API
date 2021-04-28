import Koa from 'koa';
import Router from '@koa/router';
import Body from 'koa-body';
import artistRouter from './entities/artist/artist.controller';
import albumRouter from './entities/album/album.controller';
import trackRouter from './entities/track/track.controller';
import KoaLogger from 'koa-logger';

export const app = new Koa();

// This Body() function reads the header and takes the body out of it, and stores it in ctx.request.body
app.use(Body());

// This bullshit prints the request & response info
app.use(KoaLogger());
// Middlewares
app.use(artistRouter.routes());
app.use(artistRouter.allowedMethods());

app.use(albumRouter.routes());
app.use(albumRouter.allowedMethods());

app.use(trackRouter.routes());
app.use(trackRouter.allowedMethods());
