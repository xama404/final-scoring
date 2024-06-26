const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'final',
    password: 'sengok123',
    port: 5432,
});

module.exports = pool;
