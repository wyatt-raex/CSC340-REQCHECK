const xmlReq = new XMLHttpRequest();
const searchReq = new XMLHttpRequest();
let cur_db_tab = 'USERS';

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

  cur_db_tab = editType;

  //Request the first 25 entries from the database for the respectively viewed data
  reqData(editType);
}

function reqData(editType) {
  //Upon data gotten from db, given to callback function reqListner()
  xmlReq.addEventListener("load", reqListener => {

    //Sends back a string, can parse it with json.parse()
    const db_results = JSON.parse(xmlReq.responseText);
    console.log('reqData reqListener fired');

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
  let search_txtbox = document.getElementById("input_searchDb");

  switch (editType) {

    //USERS//
    case 'USERS':
      //Replace the placeholder text in search textbox with appropriate text
      search_txtbox.setAttribute("placeholder", 'Search user via email...')

      //Reset the table so we don't get duplicate entries shown
      reset_table('USERS');

      //Display first 25 entires in database
      db_res.forEach(i => {
        display_data('USERS', i);
      });
      break;

    //GAMES//
    case 'GAMES':
      //Replace the placeholder text in search textbox with appropriate text
      search_txtbox.setAttribute("placeholder", 'Search game via title...')

      //Reset the table so we don't get duplicate entries shown
      reset_table('GAMES');

      //Display first 25 entires in database
      db_res.forEach(i => {
        display_data('GAMES', i);
      });
      break;
    
    //PROCESSOR//
    case 'PROCESSOR':
      //Replace the placeholder text in search textbox with appropriate text
      search_txtbox.setAttribute("placeholder", 'Search CPU via name...')

      //Reset the table so we don't get duplicate entries shown
      reset_table('PROCESSOR');

      //Display first 25 entires in database
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
      //Replace the placeholder text in search textbox with appropriate text
      search_txtbox.setAttribute("placeholder", 'Search GPU via name...')

      //Reset the table so we don't get duplicate entires shown
      reset_table('GRAPHICS');

      //Display first 25 entires in database
      db_res.forEach(i => {
        display_data('GRAPHICS', i);
      });
      break;
  }
}

function searchDatabase(evt) {
  let search_input = document.getElementById("input_searchDb").value;

  switch(cur_db_tab) {
    case 'USERS':

      //Find the user given the email, email is primary key
      searchReq.addEventListener("load", searchListner => {
        const db_results = JSON.parse(searchReq.responseText);
        console.log('searchDatabase searchListner fired');

        if (db_results != null) {
          console.log(db_results);

          //Also reset the table's current display
          table = document.getElementById("table-user");
          table.innerHTML = `<tr>
                              <th>Email</th>
                              <th>Password</th>
                              <th>Role</th>
                            </tr>`;
          
          //Since email is primary key, each user must have unique email so
          //We only need to display 1 row on the table

        } 
      });
      searchReq.open("GET", `http://localhost:5000/api/db/login/${search_input}`);
      searchReq.send();
      break;

    case 'GAMES':
      break;

    case 'PROCESSOR':
      break;

    case 'GRAPHICS':
      break;
  }
}

function reset_table(table) {
  switch (table) {
    case 'USERS':
      table = document.getElementById("table-user");
      table.innerHTML = `<tr>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Role</th>
                          </tr>`;
      break;
    
    case 'GAMES':
      table = document.getElementById("table-games");
      table.innerHTML = `<tr>
                            <th>Game Title</th>
                            <th>App ID</th>
                          </tr>`;
      break;

    case 'PROCESSOR':
      table = document.getElementById("table-processor");
      table.innerHTML = `<tr>
                            <th>Processor Name</th>
                            <th>Performance Value</th>
                          </tr>`;
      break;

    case 'GRAPHICS':
      table = document.getElementById("table-graphics");
      table.innerHTML = `<tr>
                            <th>Graphics Card Name</th>
                            <th>Performance Value</th>
                          </tr>`;
      break;
  }
}

function display_data(table, data) {
  let new_element = document.createElement("tr");
  new_element.setAttribute("id", `${data._id}`);

  switch (table) {
    case 'USERS':

        //Need different role selected based on what the account's role is
        let html_usr_role = ``;
        switch (data.role) {
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

        new_element.innerHTML = `<td contenteditable="true">${data.email}</td>
                                <td contenteditable="true">${data.password}</td>` + html_usr_role;
        document.getElementById("table-user").appendChild(new_element);
      break;

    case 'GAMES':
        new_element.innerHTML = `<td contenteditable="true">${data.name}</td>
                                <td contenteditable="true">${data.appid}</td>`;
        document.getElementById("table-games").appendChild(new_element);
      break;

    case 'PROCESSOR':
        new_element.innerHTML = `<td contenteditable="true">${data.name}</td>
                                <td contentediatble="true">${data.value}</td>`;

        document.getElementById("table-processor").appendChild(new_element);
      break;

    case 'GRAPHICS':
        new_element.innerHTML = `<td contenteditable="true">${data.name}</td>
                                <td contenteditable="true">${data.value}</td>`;

        document.getElementById("table-graphics").appendChild(new_element);
      break;
  }
}
