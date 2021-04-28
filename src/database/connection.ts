import 'reflect-metadata';
import {
  createConnection,
  Connection,
  ConnectionOptions
} from 'typeorm';
import { join } from 'path';
const parentDir = join(__dirname, '..');

const connectionOpts: ConnectionOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username:
    process.env.DB_USERNAME || 't2_taller_de_integracion',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 't2_my_spotify',
  entities: [
    `../entity/Artist.ts`,
    `../entity/Artist.js`,
    `../entity/Album.ts`,
    `../entity/Album.js`,
    `../entity/Track.ts`,
    `../entity/Track.js`
  ],
  synchronize: true
};

const connection: Promise<Connection> = createConnection(
  connectionOpts
);

export default connection;
