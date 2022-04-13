//Load
function load() {
  if (localStorage.getItem("userRole") != "dev") {
    window.location.href = "404.html";
    window.location.replace("404.html");
  }
  else {
    getGames(localStorage.getItem("userEmail"));
  }
}

//Get games
async function getGames(email) {
  //Get data of user
  fetch("http://localhost:5000/api/db/login/"+email)
  .then(function(res){ return res.json(); })
  .then(function(data){
    //USE http://localhost:5000/api/db/games/local/list/01
    //to loop through all associated games get all data in a json
  
  });
  console.log(userData);

}



//Games
function openGame(evt) {
  let i, tabcontent, tablinks;
  let selectElement = document.querySelector('#gameSelect');
  let output = selectElement.value;

  tabcontent = document.getElementsByClassName("gameContent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("gameLinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(output).style.display = "block";
  if (evt != null) evt.currentTarget.className += " active";
}

//Hardware
function openHardware(evt) {
  let i, tabcontent, tablinks;
  let selectElement = document.querySelector('#hardwareSelect');
  let output = selectElement.value;

  tabcontent = document.getElementsByClassName("hardwareContent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("hardwareLinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(output).style.display = "block";
  if (evt != null) evt.currentTarget.className += " active";
}
