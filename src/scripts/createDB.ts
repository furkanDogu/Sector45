import mssql from 'mssql';

(async () => {
    try {
        const pool = await new mssql.ConnectionPool({
            server: 'localhost',
            port: 1433,
            user: 'root',
            password: 'root',
            database: 'ReportServer',
        }).connect();
        await pool.query('CREATE DATABASE sector45');
        console.log('Database is successfully created');
        await pool.close();
        process.exit();
    } catch (e) {
        console.error('Schema creation is failed with error', e);
        process.exit(1);
    }
})();
