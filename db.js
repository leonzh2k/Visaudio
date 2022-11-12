require('dotenv').config();
const { Pool } = require("pg");
const pool = (() => {
    
    if (process.env.BUILD_MODE !== 'PRODUCTION') {
        return new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: false
        });
    } else {
        return new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
}})();

module.exports = pool;