require('dotenv').config();
import { app } from './app';
import connection from './database/connection';
// import databaseConnection from './database/connection';

const PORT = Number(process.env.PORT);

// databaseConnection
//   .then(() => app.listen(PORT))
//   .catch(console.error);
connection.then(() => {
  app.listen(PORT);
  console.log(
    'Koa application is up and running on port',
    PORT
  );
});
