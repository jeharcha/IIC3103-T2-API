module.exports = {
  name: 'default',
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  },
  entities: [
    './src/entities/artist/Artist.ts',
    './src/entities/artist/Artist.js',
    './src/entities/album/Album.ts',
    './src/entities/album/Album.js',
    './src/entities/track/Track.ts',
    './src/entities/track/Track.js'
  ]
};
