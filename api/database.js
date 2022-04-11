const mongoClient = require('mongodb');
const express = require('express');
const router = express.Router();
const conn = require('./conn.js');
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
    console.log('recieved');
    if (await updateUserPassword(conn.getDb(), req.params.email, req.params.newPassword) == false) {
        return res.status(400).send("No user under that email found");
    }
    else {
        res.send("User " + req.params.email + " password changed.");
    }
});

//Update Role
router.put('/login/role/:email/:newRole', async (req, res) => {
    console.log('recieved');
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
async function addHardware(client, collection, hardwareName, value) {
    const check = await client.db('hardware').collection(collection).findOne({name: hardwareName});
    if (check == undefined) {
        const data = {name: hardwareName, value: value}
        await client.db('hardware').collection(collection).insertOne(data);
        console.log("Hardware with the name " + hardwareName + " added to database with value " + value);
        return true;
    }
    else {
        console.log("Hardware with the name " + hardwareName + " already in database.");
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

//Add Local Game (for id, use rc122...)
async function addGame(client, appID, gameName, gameDesc, gameImage, windows, windowsMin, windowsRec, mac, macMin, macRec, linux, linuxMin, linuxRec) {
    const data = {
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

    if (await addGameList(client, gameName, appID) == true) {
        await client.db('gameList').collection('localGames').insertOne(data);
        console.log("Added requirement page data for " + gameName);
        return true;
    }
    else return false;

}



module.exports = router;