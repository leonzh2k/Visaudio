require('dotenv').config();
const express = require('express');
const cors = require("cors");
const parse = require("parse/node");
const fetch = require("node-fetch");
const app = express();
app.use(cors());
app.use(express.json());

var corsOptions = {
    origin: process.env.FRONTEND_ORIGIN,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

parse.initialize(process.env.BACK4APP_APP_ID, process.env.BACK4APP_JS_KEY); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
parse.serverURL = process.env.BACK4APP_SERVER_URL;

app.get("/gallery", cors(corsOptions), async (req, res) => {
    console.log("fetching visualizations...")
    const vizMetadata = parse.Object.extend('vizMetadata');
    const query = new parse.Query(vizMetadata);
    // // results shown by most recent order
    const results = await query.descending('createdAt').find();
    res.send(results);
});

app.get("/track", cors(corsOptions), async (req, res) => {
    const response = await fetch(`https://api.napster.com/v2.2/search?apikey=${process.env.NAPSTER_API_KEY}&query=${req.query.song}&type=track`);
    const trackData = await response.json();
    res.send(trackData);
})

app.listen(8080, () => {
    console.log("server started!");
    // if (process.env.BUILD_MODE === "DEVELOPMENT") {
    //     console.log("listening at http://localhost:5000");
    // }
});