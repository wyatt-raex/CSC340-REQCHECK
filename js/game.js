window.onload = function(){
  getJSON();
}

//Get ID
function getID() {
  /*
  let query = window.location.search;
  let parm = new URLSearchParams(query);
  alert(parm.get(appid))
  return parm.get(appid);
  */
  return sessionStorage.getItem('appID');
}

//Get JSON
function getJSON(){
  //Vars
  let xhr = new XMLHttpRequest();
  let id = getID();
  let url = 'https://protected-gorge-12356.herokuapp.com/https://store.steampowered.com/api/appdetails/?appids='+id;
  //alert(url);

  //Get JSON
  $.getJSON(url, function(data)
  {
    //Get Data
    const name = data[id].data.name;
    const image = data[id].data.header_image;
    const description = data[id].data.about_the_game;
    const windowsMinimum = data[id].data.pc_requirements.minimum;
    const windowsRecommended = data[id].data.pc_requirements.recommended;
    const macMinimum = data[id].data.mac_requirements.minimum;
    const macRecommended = data[id].data.mac_requirements.recommended;
    const linuxMinimum = data[id].data.linux_requirements.minimum;
    const linuxRecommended = data[id].data.linux_requirements.recommended;
    
    console.dir(data[id].data.linux_requirements);

    //Display JSON
    document.getElementById("titleName").innerHTML = 'ReqCheck - ' + name;
    document.getElementById("gameName").innerHTML = name;
    document.getElementById("gameImage").src = image;
    document.getElementById("gameDescription").innerHTML = description;
    document.getElementById("gameRequirements").innerHTML = windowsMinimum + "<br>" + windowsRecommended;

  });
}

//Compare
function compareOption() {
    //alert('message');
    const build = document.querySelector('#build');
    if (build.value == 'Failure Build') { alert('Did not meet Minimum Requirements!'); }
    else if (build.value == 'Minimum Pass Build') { alert('Met Minimum Requirements.'); }
    else { alert('Met Reccomended Requirements.'); }
}
