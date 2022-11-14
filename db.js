require('dotenv').config();
const { Pool } = require("pg");
// could we make this a singleton?
let pool = null;

module.exports = {
    createConnection: (() => {
        const buildMode = process.env.BUILD_MODE !== 'PRODUCTION';
        if (!pool) {
            pool = new Pool({
                connectionString: process.env.DATABASE_URL,
                ssl: buildMode ? false : {rejectUnauthorized: false}
            });
        }
    }),

    closeConnection: () => {
        if (pool) {
            pool.end();
        }
    },

    // queryTransactionSafe?

    query: async (text, params, callback) => {
        return await pool.query(text, params, callback);
    },
};