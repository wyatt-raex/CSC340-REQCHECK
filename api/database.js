const mongoClient = require('mongodb');
const express = require('express');
const router = express.Router();
const conn = require('./conn.js');
const { addListener } = require('nodemon');
conn.connectToServer();

//API Functions
//List Databases
router.get('/', async (req, res) => {
    const json = await listDatabases(conn.getDb());
    res.json(json);
});

////* LOGIN *////
//Get User Login
router.get('/login/:email', async (req, res) => {
    const result = await conn.getDb().db('loginData').collection('user').findOne({email: req.params.email});
    if (result == undefined) return res.status(400).send("No user under that email found");
    else res.json(result);
});

//Get all Users
router.get('/login', async (req, res) => {
    const result = await conn.getDb().db('loginData').collection('user').find({}).toArray(function(err, arr){
        if (err) throw err;
        if (arr == null) return res.status(400).send("No users found");
        else res.json(arr);
    });
});

//Add New Login
router.post('/login', async (req, res) => {
    if (await createLogin(conn.getDb(), req.body) == false) {
        return res.status(400).send("User with same email already in database.");
    }
    else res.send(req.body);
});

//Delete Login
router.delete('/login/:email', async (req, res) => {
    if (await deleteLogin(conn.getDb(), req.params.email) == false) {
        return res.status(400).send("No user with that email in database.");
    }
    else res.send("User deleted");
});

//Update Email
router.put('/login/email/:email/:newEmail', async (req, res) => {
    if (await updateUserEmail(conn.getDb(), req.params.email, req.params.newEmail) == false) {
        return res.status(400).send("No user under that email found");
    }
    else {
        res.send("User " + req.params.email + " email changed to " + req.params.newEmail)
    }
});

//Update Password
router.put('/login/password/:email/:newPassword', async (req, res) => {
    if (await updateUserPassword(conn.getDb(), req.params.email, req.params.newPassword) == false) {
        return res.status(400).send("No user under that email found");
    }
    else {
        res.send("User " + req.params.email + " password changed.");
    }
});

//Update Role
router.put('/login/role/:email/:newRole', async (req, res) => {
    if (await updateUserRole(conn.getDb(), req.params.email, req.params.newRole) == false) {
        return res.status(400).send("No user under that email found");
    }
    else {
        res.send("User " + req.params.email + " role changed to " + req.params.newRole)
    }
});

////* DEVEOPER *////
//Update Dev Games
router.post('/dev/:email', async (req, res) => {
    if (await addDeveloperGames(conn.getDb(), req.params.email, req.body) == false) {
        return res.status(400).send("No user under that email found");
    }
    else {
        res.send("Developer " + req.params.email + " games updated.");
    }
});

////* HARDWARE *////
//Get all hardware
router.get('/hardware/:type', async (req, res) => {
    const result = await conn.getDb().db('hardware').collection(req.params.type).find({}).toArray(function(err, arr){
        if (err) throw err;
        if (arr == null) return res.status(400).send("No hardware found");
        else res.json(arr);
    });
});

//Add Hardware
router.post('/hardware/:type', async (req, res) => {
    if (await addHardware(conn.getDb(), req.params.type, req.body) == false) {
        return res.status(400).send("Hardware with the same name already in database.");
    }
    else res.send(req.body);
});

//Delete Processor
router.delete('/hardware/:type/:name', async (req, res) => {
    if (await deleteHardware(conn.getDb(), req.params.type, req.params.name) == false) {
        return res.status(400).send("No hardware with name in database.");
    }
    else res.send("Hardware deleted");
});

//Update Hardware Value
router.put('/hardware/:type/:name/:newValue', async (req, res) => {
    if (await updateHardwareValue(conn.getDb(), req.params.type, req.params.name, req.params.newValue) == false) {
        return res.status(400).send("No hardware under that name found");
    }
    else {
        res.send("Hardware value updated.");
    }
});

////* GAMES *////
//Get list of all steam games
router.get('/games/steam', async (req, res) => {
    const result = await conn.getDb().db('gameList').collection('steamGameList').find({}).toArray(function(err, arr){
        if (err) throw err;
        if (arr == null) return res.status(400).send("No steam games found");
        else res.json(arr);
    });
});

//Get list of all local games
router.get('/games/local', async (req, res) => {
    const result = await conn.getDb().db('gameList').collection('localGameList').find({}).toArray(function(err, arr){
        if (err) throw err;
        if (arr == null) return res.status(400).send("No local games found");
        else res.json(arr);
    });
});

//Add local game
router.post('/games/local/:appID', async (req, res) => {
    if (await addLocalGame(conn.getDb(), req.params.appID, req.body) == false) {
        return res.status(400).send("Local game with same ID already in database");
    }
    else res.send(req.body);
});

//Remove local game
router.delete('/games/local/:appID', async (req, res) => {
    if (await removeLocalGame(conn.getDb(), req.params.appID) == false) {
        return res.status(400).send("No game with ID in database.");
    }
    else res.send("Game deleted");
});

//Update local game
router.post('/games/local/update/:appID', async (req, res) => {
    if (await updateLocalGame(conn.getDb(), req.params.appID, req.body) == false) {
        return res.status(400).send("No local game with ID.");
    }
    else res.send(req.body);
});

//MongoDB Database Functions//
//List Databases
async function listDatabases(client) {
    const databaseList = await client.db().admin().listDatabases();
    return databaseList.databases;
}

//Create Login
async function createLogin(client, data) {
    //Check for same email.
    const email = data['email'];
    const check = await client.db('loginData').collection('user').findOne({email: email});
    if (check == undefined) {
        //Create Login
        /*
        const newLogin = {
            email: email,
            password: password,
            role: role,
            games: []
        };
        */

        //Add
        await client.db('loginData').collection('user').insertOne(data);
        console.log("New Login Added for user " + email);
        return true;
    }
    else {
        console.log("User with same email already in database.");
        return false;
    }
}

//Delete Login
async function deleteLogin(client, email) {
    const check = await client.db('loginData').collection('user').findOne({email: email});
    if (check != undefined) {
        await client.db('loginData').collection('user').deleteOne({email: email});
        console.log("Login with email " + email + "was deleted.");
        return true;
    }
    else {
        console.log("No login with email " + email +" found.");
        return false;
    }
}

//Update role
async function updateUserRole(client, userEmail, newRole) {
    const check = await client.db('loginData').collection('user').findOne({email: userEmail});
    if (check) {
        await client.db('loginData').collection('user').updateOne({email: userEmail}, {$set: {role: newRole}});
        console.log("User " + userEmail + " role changed from " + check.role + " to " + newRole);
        return true;
    }
    else {
        console.log("No user under that email found");
        return false;
    }
}

//Update Password
async function updateUserPassword(client, userEmail, newPassword) {
    const check = await client.db('loginData').collection('user').findOne({email: userEmail});
    if (check) {
        await client.db('loginData').collection('user').updateOne({email: userEmail}, {$set: {password: newPassword}});
        console.log("User " + userEmail + " password changed.");
        return true;
    }
    else {
        console.log("No user under that email found");
        return false;
    }
}

//Update Email 
async function updateUserEmail(client, userEmail, newEmail) {
    const check = await client.db('loginData').collection('user').findOne({email: userEmail});
    if (check) {
        await client.db('loginData').collection('user').updateOne({email: userEmail}, {$set: {email: newEmail}});
        console.log("User " + userEmail + "email changed to " + newEmail);
        return true;
    }
    else {
        console.log("No user under " + userEmail + " found");
        return false;
    }
}

//Add associated games to Game Developers
async function addDeveloperGames(client, userEmail, data){
    const user = await client.db('loginData').collection('user').findOne({email: userEmail});
    if (user) {
        //user.games.push(appID);
        await client.db('loginData').collection('user').updateOne({email: userEmail}, {$set: {games: data}});
        console.log("Games for developer " + userEmail + " has been updated.");
        return true;
    }
    else {
        console.log("No developer under email " + userEmail + " found.");
        return false;
    }
}

//Remove an associated game from Game Developer (not used)
async function removeDeveloperGames(client, userEmail, appID){
    const user = await client.db('loginData').collection('user').findOne({email: userEmail}, {role: "dev"});
    if (user) {
        let d = false;
        for (let i = -1; i < user.games.length; i++) {
            if (d == false) {
                if (user.games[i] == appID) {
                    user.games[i] = undefined;
                    d = true;
                }
            }
            else {
                user.games[i-2] = user.games[i];
            }       
        }
        if (d == true) {
            user.games.pop();
            console.log("Game with ID " + appID + " was removed from developer " + userEmail);
        } 
        else console.log("Game with ID " + appID + " was not found in developer " + userEmail);
        await client.db('loginData').collection('user').updateOne({email: userEmail}, {$set: {games: user.games}});
        
        return true;
    }
    else {
        console.log("No developer under email " + userEmail + " found.");
        return false;
    }
}

//Update Comparator Value
async function updateHardwareValue(client, collection, hardwareName, newValue) {
    const check = await client.db('hardware').collection(collection).findOne({name: hardwareName});
    if (check != undefined)
    {
        await client.db('hardware').collection(collection).updateOne({name: hardwareName}, {$set: {value: newValue}});
        console.log("Value of hardware " + hardwareName + " set to " + newValue);
        return true;
    }
    else {
        console.log("No hardware with the name " + hardwareName + " was found.");
        return false;
    }
}

//Add New Hardware 
async function addHardware(client, collection, data) {
    const check = await client.db('hardware').collection(collection).findOne({name: data["name"]});
    if (check == undefined) {
        //const data = {name: hardwareName, value: value}
        await client.db('hardware').collection(collection).insertOne(data);
        console.log("Hardware with the name " + data["name"] + " added to database with value " + data["value"]);
        return true;
    }
    else {
        console.log("Hardware with the name " + data["name"] + " already in database.");
        return false;
    }
     
}

//Delete Hardware
async function deleteHardware(client, collection, hardwareName) {
    const check = await client.db('hardware').collection(collection).findOne({name: hardwareName});
    if (check != undefined) {
        await client.db('hardware').collection(collection).deleteOne({name: hardwareName});
        console.log("Hardware with the name " + hardwareName + " was deleted from the database.");
        return true;
    } 
    else {
        console.log("No hardware with the name " + hardwareName + " was found.");
        return false;
    }
}

//Add Game to List
async function addGameList(client, gameName, appID) {
    const check = await client.db('gameList').collection('localGameList').findOne({appid: appID});
    if (check == undefined) {
        const data = {
            appid: appID,
            name: gameName
        }
        await client.db('gameList').collection('localGameList').insertOne(data);
        console.log(gameName + " added to local game list.");
        return true;
    }
    else {
        console.log("A game with this ID already exists.");
        return false;
    }

}

//Add Local Game (for id, use rc12...)
async function addLocalGame(client, appID, data) {
    /*
    const data = {
        appid: appID
        [appID]: {
            name: gameName,
            appid: appID,
            about_the_game: gameDesc,
            header_image: gameImage,
            platforms: {windows: windows, mac: mac, linux: linux},
            pc_requirements: {minimum: windowsMin, recommended: windowsRec},
            mac_requirements: {minimum: macMin, recommended: macRec},
            linux_requirements: {minimum: linuxMin, recommended: linuxRec}
        }
    }
    */

    if (await addGameList(client, data[appID].name, data[appID].appid) == true) {
        await client.db('gameList').collection('localGames').insertOne(data);
        console.log("Added requirement page data for " + data[appID].name);
        return true;
    }
    else return false;

}

//Remove local game
async function removeLocalGame(client, appID) {
    const check = await client.db('gameList').collection('localGameList').findOne({appid: appID});
    if (check == undefined) {
        console.log("No game with appID " + appID + "found.");
        return false;
    }
    else {
        await client.db('gameList').collection('localGameList').deleteOne({appid: appID});
        await client.db('gameList').collection('localGames').deleteOne({appid: appID});
        console.log("Game with the appID " + appID + " was deleted from the database.");
    }
}

//Update Local game
async function updateLocalGame(client, appID, data) {
    const check = await client.db('gameList').collection('localGameList').findOne({appid: appID});
    if (check == undefined) {
        console.log("No game with appID " + appID + "found.");
        return false;
    }
    else {
        await client.db('gameList').collection('localGameList').updateOne({appid: appID}, {$set: {name: data[appID].name}});
        await client.db('gameList').collection('localGames').updateOne({appid: appID}, {$set: data});
        console.log("Updated requirement page data for " + data[appID].name);
    }
}


//Make Requirements right format 
async function formatRequirement(min, cpu, memory, gpu, storage, extra) {
    let requirement = '';

    //Type
    if (min) requirement += '<strong>Minimum:</strong><br>';
    else requirement += '<strong>Recommended:</strong>';

    //Parts
    requirement += `<li><strong>Processor:</strong> ${cpu}<br></li>`;
    requirement += `<li><strong>Memory:</strong> ${memory}<br></li>`;
    requirement += `<li><strong>Graphics:</strong> ${gpu}<br></li>`;
    requirement += `<li><strong>Storage:</strong> ${storage}<br></li>`;
    if (extra != undefined) requirement += `<li><strong>Additional Notes:</strong> ${extra}<br></li>`;
    return requirement;
}



module.exports = router;