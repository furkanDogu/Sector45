import entities from './src/entities';

module.exports = {
    type: 'mssql',
    host: 'localhost',
    port: 1433,
    username: 'root',
    password: 'root',
    database: 'sector45',
    logging: true,
    entities: entities,
    migrations: ['src/migrations/**/*.ts'],
    cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migrations',
    },
};
