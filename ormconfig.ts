import entities from './src/entities';

module.exports = {
    entities,
    type: 'mssql',
    host: 'localhost',
    port: 1433,
    username: 'root',
    password: 'root',
    database: 'sector45',
    synchronize: true,
    logging: false,
    migrations: ['src/migrations/**/*.ts'],
    cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migrations',
    },
};
