require('dotenv').config();
const express = require('express');
const cors = require("cors");
const fetch = require("node-fetch");
const db = require("./db");
const app = express();
app.use(cors());
app.use(express.json());

db.createConnection();

var corsOptions = {
    origin: process.env.FRONTEND_ORIGIN,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.get("/", cors(corsOptions), async (req, res) => {
    res.status(200).send("Hello, World!");
});

app.get("/gallery", cors(corsOptions), async (req, res) => {
    console.log("fetching visualizations...")
    const results = await db.query("SELECT * FROM visualizations;");
    // format into the structure that the frontend expects
    let formattedResults = [];
    results.rows.forEach(row => {
        formattedResults.push({
            vizMetadata: {
                id: row.id,
                updatedAt: row.updated_at,
                artistName: row.song_artist,
                trackName: row.song_name,
                songURL: row.song_url,
                canvasBackgroundColor: row.graphics.canvasBackgroundColor,
                canvasWidth: row.graphics.canvasWidth,
                canvasHeight: row.graphics.canvasHeight, 
                dbReadableCanvasObjects: row.graphics.canvasObjects
            }
        })
    });
    res.send(formattedResults);
});

app.get("/track", cors(corsOptions), async (req, res) => {
    const response = await fetch(`https://api.napster.com/v2.2/search?apikey=${process.env.NAPSTER_API_KEY}&query=${req.query.song}&type=track`);
    const trackData = await response.json();
    res.send(trackData);
});

app.post("/submit", cors(corsOptions), async (req, res) => {
    // send to DB
    const data = req.body.dbEntry.vizMetadata;
    console.log(req.body.dbEntry.vizMetadata);
    const text = `INSERT INTO visualizations (song_name, song_artist, song_url, graphics) VALUES($1, $2, $3, $4) RETURNING *`;
    const graphics = {
        canvasBackgroundColor: data.canvasBackgroundColor,
        canvasWidth: data.canvasWidth,
        canvasHeight: data.canvasHeight,
        canvasObjects: data.dbReadableCanvasObjects
    }
    const values = [data.trackName, data.artistName, data.songURL, graphics];
    const result = await db.query(text, values);
    console.log(result)
    res.send(result);
});

module.exports = app;

