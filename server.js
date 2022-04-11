const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
const url = require('url');
const express = require('express');

//const db = require('./api/database.js');
const app = express();

//Server
console.log(path.join(__dirname, 'css'));
app.use(express.static(path.join(__dirname, 'pages')));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ' + PORT))

//Database API
//db.database();
app.use(express.json()) //Use Body Parser for JSON Post requests
app.use(express.urlencoded({extended: false})); //Allows use of url encoded data
app.use('/api/db', require('./api/database.js'))

//SteamAPI//
app.get('/api/steam/:appID', (req, res) => {
    //Get JSON
    const appID = req.params.appID;
    console.log("Incoming SteamAPI Request for ID: " + appID);

    https.get(`https://store.steampowered.com/api/appdetails/?appids=${appID}&l=english`, (resp) => {
        let body = "";
        resp.on("data", (chunk) => {
            body += chunk;
        });

        resp.on("end", () => {
            try {
                let json = JSON.parse(body);
                res.end(JSON.stringify(json));
            } catch (error) {
                console.error(error.message);
            };
        });

        }).on("error", (error) => {
            console.error(error.message);
    });
});