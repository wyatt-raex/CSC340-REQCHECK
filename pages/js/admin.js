const xmlReq = new XMLHttpRequest();

//Load
function load(evt, editType){
  openType(evt, editType);
}

//Switch between tabs
function openType(evt, editType) {
  let i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(editType).style.display = "block";
  if (evt != null) evt.currentTarget.className += " active";

  //Request the first 25 entries from the database for the respectively viewed data
  reqData(editType);
}

function reqData(editType) {
  //Upon data gotten from db, given to callback function reqListner()
  xmlReq.addEventListener("load", reqListener => {

    //Sends back a string, can parse it with json.parse()
    const db_results = JSON.parse(xmlReq.responseText);
    console.log(db_results);

    if (db_results != null) {
      populateTable(db_results, editType);
    }
  });

  switch(editType) {
    case 'USERS':
      xmlReq.open("GET", "http://localhost:5000/api/db/login-limit");
      break;
    case 'GAMES':
      xmlReq.open("GET", "http://localhost:5000/api/db/games/steam-limit");
      break;
    case 'PROCESSOR':
      xmlReq.open("GET", "http://localhost:5000/api/db/hardware/limit/processor");
      break;
    case 'GRAPHICS':
      xmlReq.open("GET", "http://localhost:5000/api/db/hardware/limit/graphics");
  }
  xmlReq.send();
}

function populateTable(db_res, editType) {
 // let tables = ['table-user', 'table-games', 'table-processor', 'table-graphics'];
  let table = '';

  switch (editType) {

    //USERS//
    case 'USERS':
      //Reset the table so we don't get duplicate entries shown
      table = document.getElementById("table-user");
      table.innerHTML = `<tr>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Role</th>
                          </tr>`;

      db_res.forEach(i => {
        let new_element = document.createElement("tr");
        new_element.setAttribute("id", `${i._id}`);

        let html_usr_role = ``;
        switch (i.role) {
          case 'user':
            html_usr_role = `<td contenteditable="false">
                              <select>
                                <option selected>User</option>
                                <option>Game Developer</option>
                                <option>Admin</option>
                              </select>
                            </td>`;
            break;
          
          case 'dev':
            html_usr_role = `<td contenteditable="false">
                              <select>
                                <option>User</option>
                                <option selected>Game Developer</option>
                                <option>Admin</option>
                              </select>
                            </td>`;
            break;

          case 'admin':
            html_usr_role = `<td contenteditable="false">
                              <select>
                                <option>User</option>
                                <option>Game Developer</option>
                                <option selected>Admin</option>
                              </select>
                            </td>`;
            break;
        }

        new_element.innerHTML = `<td contenteditable="true">${i.email}</td>
                                <td contenteditable="true">${i.password}</td>` + html_usr_role;
        document.getElementById("table-user").appendChild(new_element);
      });
      break;
    //GAMES//
    case 'GAMES':
      //Reset the table so we don't get duplicate entries shown
      table = document.getElementById("table-games");
      table.innerHTML = `<tr>
                            <th>Game Title</th>
                            <th>App ID</th>
                          </tr>`;

      db_res.forEach(i => {
        let new_element = document.createElement("tr");
        new_element.setAttribute("id", `${i._id}`);

        new_element.innerHTML = `<td contenteditable="true">${i.name}</td>
                                <td contenteditable="true">${i.appid}</td>`;
        document.getElementById("table-games").appendChild(new_element);
      });
      break;
    
    //PROCESSOR//
    case 'PROCESSOR':
      //Reset the table so we don't get duplicate entries shown
      table = document.getElementById("table-processor");
      table.innerHTML = `<tr>
                            <th>Processor Name</th>
                            <th>Performance Value</th>
                          </tr>`;

      db_res.forEach(i => {
        let new_element = document.createElement("tr");
        new_element.setAttribute("id", `${i._id}`);

        new_element.innerHTML = `<td contenteditable="true">${i.name}</td>
                                <td contentediatble="true">${i.value}</td>`;

        document.getElementById("table-processor").appendChild(new_element);
      });
      break;

    //GRAPHICS//
    case 'GRAPHICS':
      table = document.getElementById("table-graphics");
      table.innerHTML = `<tr>
                            <th>Graphics Card Name</th>
                            <th>Performance Value</th>
                          </tr>`;

      db_res.forEach(i => {
        let new_element = document.createElement("tr");
        new_element.setAttribute("id", `${i._id}`);

        new_element.innerHTML = `<td contenteditable="true">${i.name}</td>
                                <td contenteditable="true">${i.value}</td>`;

        document.getElementById("table-graphics").appendChild(new_element);
      });
      break;
  }
  

  // console.log(db_res[0].email);
  // let testElement = document.createElement("tr");
  // testElement.innerHTML = `<td contenteditable="true"> Steven Bailey</td>
  //                         <td contenteditable="true"> test@reqcheck.com </td>
  //                         <td contenteditable="false">
  //                           <select>
  //                             <option selected>User</option>
  //                             <option>Game Developer</option>
  //                             <option>Admin</option>
  //                           </select>
  //                         </td>`;
  // document.getElementById("table-user").appendChild(testElement);
}
