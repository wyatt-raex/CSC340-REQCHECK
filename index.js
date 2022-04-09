const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
const url = require('url');
const { mainModule, hasUncaughtExceptionCaptureCallback } = require('process');
const { format } = require('path');
const { stringify } = require('querystring');

const db = require('./js/database.js');

//Server
const server = http.createServer((req, res) => {
    //Get Data  
    const par = url.parse(req.url, true);
    //console.log(par.pathname);
    let filePath = path.join(__dirname, '/', req.url == '/' ? 'index.html' : par.pathname); //File Path
    let extName = path.extname(filePath); //Get extenstion
    let contentType = 'text/html'; //Intial Content Type   

    //Check File Extenstion and Set
    switch (extName)
    {
        case '.js':
            contentType = 'text/javascript';
        break;

        case '.css':
            contentType = 'text/css';
        break;

        case '.json':
            contentType = 'text/json';
        break;

        case '.png':
            contentType = 'text/png';
        break;

        case '.jpg':
            contentType = 'text/jpg';
        break;
    }

    //Read File
    fs.readFile(filePath, (err, content) => {
        if (err){
            if (err.code == 'ENOENT') {
                //Page not found
                console.log("Page Not Found!" + filePath); 
            }
            else {
                //Some Other Error
                console.log("Sever Error (most likely)"); 
            }
        }
        else {
            //Load page
            res.writeHead(200, { 'Content-Type': contentType} );
            res.end(content, 'utf8');
        }
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log('Server running on port ' + PORT));

db.database();

//SteamAPI Server//
const requestListener = http.createServer((req, res) => {
    //Get JSON
    const par = url.parse(req.url, true);
    console.log("Incoming SteamAPI Request for ID: " + par.query.appID);
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
    https.get('https://store.steampowered.com/api/appdetails/?appids=' + par.query.appID + '&l=english', (resp) => {
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
requestListener.listen(3000, function() {console.log("Listening at port 3000")});