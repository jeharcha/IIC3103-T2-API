import { app } from './app';
// import databaseConnection from './database/connection';

const PORT = Number(process.env.PORT) || 3001;

// databaseConnection
//   .then(() => app.listen(PORT))
//   .catch(console.error);
app.listen(PORT);
