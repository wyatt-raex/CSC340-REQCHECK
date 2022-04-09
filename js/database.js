const mongoClient = require('mongodb');

//MongoDB Database//
async function database() {
    //Create Mongo Client
    const uri = 'mongodb+srv://rcadmin:ReqCheck0@reqcheckcluster.fsgtm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
    const client = new mongoClient.MongoClient(uri);

    //Attempt connection
    try {
        await client.connect()
        //await listDatabases(client);
        //await createLogin(client, 'admin@reqcheck.com', 1233, "admin");
        //await createLogin(client, 'user@reqcheck.com', 1233, "user");
        //await createLogin(client, 'gamedev@reqcheck.com', 1233, "dev");
        //await addDeveloperGames(client, 'gamedev@reqcheck.com', 14);
        //await updateUserRole(client, 'user@reqcheck.com', 'user');
        //await addGameList(client, "Minecraft", 'rc0');
        //let min = await formatRequirement(true, "Intel Core i2-3210 3.2 GHz/ AMD A8-7600 APU 3.1 GHz or equivalent", "4 GB", "Intel HD Graphics 4000 / AMD Radeon R5 series with OpenGL 4.4", "2 GB");
        //let rec = await formatRequirement(false, "Intel Core i2-3210 3.2 GHz / AMD A8-7600 APU 3.1 GHz or better", "8 GB", "Nvidia GeForce 700 Series or AMD Radeon Rx 200 Series with OpenGL 4.5", "4 GB SSD");
        //await addGame(client, "rc0", "Minecraft", "Prepare for an adventure of limitless possibilities as you build, mine, battle mobs, and explore the ever-changing Minecraft landscape.", "https://i.pinimg.com/originals/da/8f/b9/da8fb981a87a3052b7da6cccf0604fef.png", true, min, rec, true, "", "", true, "", "");
        //await deleteLogin(client, 'gamedev@reqcheck.com');
        //await updateUserPassword(client, 'admin@reqcheck.com', '1233');
        //await updateUserEmail(client, 'admin@reqcheck.com', "admin1@reqcheck.com");
        //await removeDeveloperGames(client, 'gamedev@reqcheck.com', 645126);
        await updateHardwareValue(client, "AMD Ryzen Threadripper PRO 5994WX", 108822);
    }
    catch (e) {
        console.log(e);
    }
    finally {
        await client.close(); 
    }
}

//List Databases
async function listDatabases(client) {
    const databaseList = await client.db().admin().listDatabases();

    console.log("Databases");
    databaseList.databases.forEach(db => {
        console.log(`- ${db.name}`);
    })
}

//Create Login
async function createLogin(client, email, password, role) {
    //Check for same email.
    const check = await client.db('loginData').collection('user').findOne({email: email});
    if (check == undefined) {
        //Create Login
        const newLogin = {
            email: email,
            password: password,
            role: role,
            games: []
        };

        //Add
        await client.db('loginData').collection('user').insertOne(newLogin);
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
        console.log("User " + userEmail + "role changed from " + user.role + " to " + newRole);
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
async function addDeveloperGames(client, userEmail, appID){
    const user = await client.db('loginData').collection('user').findOne({email: userEmail});
    if (user) {
        user.games.push(appID);
        await client.db('loginData').collection('user').updateOne({email: userEmail}, {$set: {games: user.games}});
        console.log("Game with ID " + appID + " added to developer with email " + userEmail);
        return true;
    }
    else {
        console.log("No developer under email " + userEmail + " found.");
        return false;
    }
}

//Remove an associated game from Game Developer 
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
async function updateHardwareValue(client, hardwareName, newValue) {
    const graphics = await client.db('hardware').collection('graphics').findOne({name: hardwareName});
    if (graphics != undefined)
    {
        await client.db('hardware').collection('graphics').updateOne({name: hardwareName}, {$set: {value: newValue}});
        console.log("Value of hardware " + hardwareName + " set to " + newValue)
        return true;
    }
    else {
        const processor = await client.db('hardware').collection('processor').findOne({name: hardwareName});
        if (processor != undefined) {
            await client.db('hardware').collection('processor').updateOne({name: hardwareName}, {$set: {value: newValue}});
            console.log("Value of hardware " + hardwareName + " set to " + newValue)
            return true;
        }
        else {
            console.log("No hardware with the name " + hardwareName + "was found.");
            return false;
        }
    }
}

//Add New Hardware 
async function addHardware(client, hardwareName, value) {

}

//Delete Hardware
async function deleteHardware(client, hardwareName) {

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

module.exports = {database, listDatabses, createLogin, deleteLogin, 
                    updateUserRole, updateUserPassword, updateUserEmail,
                    addDeveloperGames, removeDeveloperGames, 
                    updateHardwareValue, addHardware, deleteHardware,
                    addGameList, formatRequirement, addGame};