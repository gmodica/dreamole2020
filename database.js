'use strict';
const { Pool } = require('pg')
const client = new Pool(
    {
        connectionString : process.env.DATABASE_URL,
        ssl: true
    }
);

module.exports = client;