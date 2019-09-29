import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { createConnection } from 'typeorm';

import routes from './routes';
import { API_PORT } from './appConfig';

(async () => {
    try {
        await createConnection();
        console.info('Succesfully connected to the db');

        const app = express();

        app.use(cors());
        app.use(helmet());
        app.use(bodyParser.json());
        app.use('/', routes);

        app.listen(API_PORT, () => {
            console.info(`The server is started on port ${API_PORT}`);
        });
    } catch (e) {
        console.error('An error occured while connecting to the db', e);
    }
})();
