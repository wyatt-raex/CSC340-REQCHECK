//const db = require('./database.js');

//Load
function load(evt, editType){
  populateTable();
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
}

function populateTable() {
  let testElement = document.createElement("tr");
  testElement.innerHTML = `<td contenteditable="true"> Steven Bailey</td>
                          <td contenteditable="true"> test@reqcheck.com </td>
                          <td contenteditable="false">
                            <select>
                              <option selected>User</option>
                              <option>Game Developer</option>
                              <option>Admin</option>
                            </select>
                          </td>`;
  document.getElementById("table-user").appendChild(testElement);

  //db.database();
  //db.listDatabases();
}