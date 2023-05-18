import express, { Request, Response } from 'express';
import controller from './controllers/controller';
import { createConnection } from 'typeorm';

createConnection().then(() => {
    const app = express();

app.use(express.json());

app.use(controller)
app.listen(8000, () => console.log('Server running on port 8000'));
});




