import 'reflect-metadata';
import {
  createConnection,
  Connection,
  ConnectionOptions,
  getConnectionOptions
} from 'typeorm';

// const connectionOpts: ConnectionOptions = {
//   type: 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   port: Number(process.env.DB_PORT) || 3001,
//   username: process.env.DB_USERNAME || 't2-dcc-records-api',
//   password: process.env.DB_PASSWORD || '123456',
//   database: process.env.DB_NAME || 'default',
//   entities: [
//     `../entities/Artist.ts`,
//     `../entities/Artist.js`,
//     `../entities/Album.ts`,
//     `../entities/Album.js`,
//     `../entities/Track.ts`,
//     `../entities/Track.js`
//   ],
//   synchronize: true
// };

const connection: Promise<Connection> = getConnectionOptions().then(
  (op) => createConnection(op)
);

export default connection;
