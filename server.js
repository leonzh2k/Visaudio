require('dotenv').config();
const express = require('express');
const cors = require("cors");
const parse = require("parse/node");
const app = express();
app.use(cors());
app.use(express.json());

parse.initialize(process.env.BACK4APP_APP_ID, process.env.BACK4APP_JS_KEY); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
parse.serverURL = process.env.BACK4APP_SERVER_URL;

app.get("/gallery", async (req, res) => {
    console.log("fetching visualizations...")
    const vizMetadata = parse.Object.extend('vizMetadata');
    const query = new parse.Query(vizMetadata);
    // // results shown by most recent order
    const results = await query.descending('createdAt').find();
    res.send(results);
});

app.listen(8080, () => {
    console.log("server started!");
    // if (process.env.BUILD_MODE === "DEVELOPMENT") {
    //     console.log("listening at http://localhost:5000");
    // }
});