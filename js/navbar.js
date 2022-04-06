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


//Search (Code based on system by Traversy Media)
const searchBar = document.getElementById("searchBar");
const searchButton = document.getElementById("searchButton");
const matchList = document.getElementById("matchList");
matchList.innerHTML = '';
//matchList.display = false;

//Search Games
const searchGames = async searchText => {
  //Get Data
  const res = await fetch('../data/gameList.json')
  const games = await res.json();
  const gameArray = games.apps;
  //matchList.display = true;
  
  //console.log(games.apps[4].name);

  //Get Matches
  let matches = gameArray.filter(game => {
    const regex = new RegExp(`^${searchText}`, 'gi');
    return game.name.match(regex);
  })

  //Have at least 1 character to search
  if (searchText.length == 0) {
      matches= [];
      matchList.innerHTML = '';
  }
  //console.log(matches);

  //Get Path
  let gameUrl = 'game.html';
  if (window.location.pathname == '/index.html')  gameUrl = './pages/game.html';

  //Display Results
  if (matches.length > 0) {
    const html = matches.map(
      match => `
        <li> <a href="${gameUrl}"; onclick = gotoGame(${match.appid})>${match.name}</a></li>`
    ).join('');
    console.log(html);

    matchList.innerHTML = html;
  }


  
}

  searchBar.addEventListener('input', () => searchGames(searchBar.value));
  //if (matchList.innerHTML == '') matchList.display = false;

  /*
function search(){
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
*/
