require('dotenv').config();


import express from 'express';
import { createConnection } from 'typeorm';
import { routes } from './routs';
import cors from 'cors';
import cookieParser from 'cookie-parser';

createConnection().then(() => {
    const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors ({origin: ['http://localhost:3000' , 'http://localhost:8080' , 'http://localhost:4200' ],/// 3000 - react, 8080 - vue, 4200 - angular
credentials: true,}))  /// credentials: true - for cookies

routes(app);

app.listen(8000, () => console.log('Server running on port 8000'));
});




