//Add Buttons for respective Dashboards
const adminButton = document.getElementById("adminButton");
//adminButton.remove();

const devButton = document.getElementById("devButton");
//devButton.remove();

//Goto Admin Dashbaord
function gotoAdmin(){
  //document.assign('admin.html');
}

//Goto Developer Dashboard
function gotoDev(){

}

//Goto login page
function gotoLogin(){

}

//Goto Hardware Page
function gotoHardware(){

}

//Goto Game Page
function gotoGame(id){
  sessionStorage.setItem('appID', id);
}

function search(){
    let searchBar = document.getElementById("searchBar");
    let searchButton = document.getElementById("searchButton");

    //Get current page
    let page = window.location.href.split('/');
    page = page[page.length-1];

    //Send to page
    if (searchBar.value == "Minecraft")
    {
      if (page == "index.html") location.assign('pages/minecraft.html');
      else location.assign('minecraft.html');
    }
    else alert("Game not found. Please try again.")
}
