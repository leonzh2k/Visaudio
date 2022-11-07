require('dotenv').config();
const express = require('express');
const parse = require("parse/node");
const app = express();
app.use(express.json());

// BACK4APP_APP_ID: "01t8qb2FLCXC70NIrlplthJEfFpLVhvx6RCK2S2Z",
// BACK4APP_JS_KEY: "MfK5pEk5haJ95TcyTeIkYQdodIQJ2sk1Pn3jZCXX",
// BACK4APP_SERVER_URL: "https://parseapi.back4app.com/",
// CORS_PROXY_SERVER_URL: "https://cors-anywhere-rzaw.onrender.com",
// NAPSTER_API_KEY: "ZDIxMDM1NTEtYjk3OS00YTI1LWIyYjItYjBjOWVmMWYyN2I3"

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