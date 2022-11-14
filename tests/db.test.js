// const app = require("../app");
const db = require("../db");
const fs = require('fs');
const process = require('process');
const path = require('path');

let pool; // db connection used across all tests (careful of concurrent test data rcs)
beforeAll(async () => {
    // construct db
    pool = db.createConnection();
    try {
        // adding if exists prevents errors if table doesn't exist
        await pool.query("DROP TABLE IF EXISTS visualizations;");
        const sql = fs.readFileSync(path.resolve(__dirname, '../db/visaudio.sql')).toString();
        await pool.query(sql);
    } catch(err) {
        console.error("Issue with building database.")
        process.exit(1); // will prevent any test from executing
    }
});

// clear data between tests
afterEach(async () => {
    await pool.query("DELETE FROM visualizations;")
})

afterAll(async () => {
    await pool.query("DROP TABLE IF EXISTS visualizations;")
    db.closeConnection();
});

describe("test singleton db connection", () => {
    test("it is a singleton", () => {
        const pool1 = db.createConnection();
        const pool2 = db.createConnection();
        expect(pool1).toEqual(pool);
        expect(pool2).toEqual(pool);
        expect(pool1).toEqual(pool2);
    })
});

describe("test non-null constraints", () => {
    test.each([
        {
            columns: "song_artist, song_url, graphics", 
            vals: ["artist1", "https://song.mp3", `{}`], 
            expected: "song_name"
        },
        {
            columns: "song_name, song_url, graphics", 
            vals: ["s1", "https://song.mp3", `{}`], 
            expected: "song_artist",
        },
        {
            columns: "song_name, song_artist, graphics", 
            vals: ["s1", "a1", `{}`], 
            expected: "song_url",
        },
        {
            columns: "song_name, song_artist, song_url", 
            vals: ["s1", "a1", "https://song.mp3"], 
            expected: "graphics"
        },
    ])('$expected column cannot be null', ({columns, vals, expected}) => {
        const text = `INSERT INTO visualizations (${columns}) VALUES($1, $2, $3)`;
        const values = vals;
        let c;
        return pool.connect().then(client => {
            c = client;
            return client.query(text, values);
        }).then(result => {
            c.release();
            expect(true).toEqual(false); // definitely fail if query succeeds
        }).catch(err => {
            c.release();
            expect(err).toEqual(new Error(`null value in column "${expected}" of relation "visualizations" violates not-null constraint`));
        })
    });
});

describe("test successful insertion", () => {
    test("should insert successfully", async () => {
        const text = `INSERT INTO visualizations (song_name, song_artist, song_url, graphics) VALUES($1, $2, $3, $4) RETURNING *`;
        const values = ["song1", "artist1", "https://song.mp3", {canvasColor: "red"}];
        let r;
        return pool.connect().then(client => {
            r = client;
            return client.query(text, values);
        }).then(result => {
            r.release();
            expect(result.rows[0].song_name).toEqual("song1"); 
            expect(result.rows[0].song_artist).toEqual("artist1"); 
            expect(result.rows[0].song_url).toEqual("https://song.mp3"); 
            expect(result.rows[0].graphics.canvasColor).toEqual("red"); 
        }).catch(err => {
            r.release();
            expect(true).toEqual(false); // definitely fail if query failed
        })
    });
});


