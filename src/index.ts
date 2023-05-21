import express from 'express';
import { createConnection } from 'typeorm';
import { routes } from './routs';

createConnection().then(() => {
    const app = express();

app.use(express.json());

routes(app);

app.listen(8000, () => console.log('Server running on port 8000'));
});




