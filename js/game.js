window.onload = function(){
  getJSON();
}

//Get ID
function getID() {
  let query = window.location.search;
  const urlParams = new URLSearchParams(query);
  let id = urlParams.get('app_id');
  return id;
}

//Get JSON
function getJSON(){
  //Vars
  let xhr = new XMLHttpRequest();
  let id = getID();
  //let url = 'https://store.steampowered.com/api/appdetails/?appids='+id;
  let url = 'http://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json';
  alert(url);

  $.getJSON(url, function(data)
  {
    alert(data);
  });

  //Request
  /*
  fetch(url, {method: 'GET', mode: 'cors'})
    .then (function(response) {
      return response.json();
    })
    .then (function(data) {
      appendData(data);
    })
    .catch (function(error) {
      console.log("Unable to fetch data, please try again.");
    });
    */
}

//Compare
function compareOption() {
    //alert('message');
    const build = document.querySelector('#build');
    if (build.value == 'Failure Build') { alert('Did not meet Minimum Requirements!'); }
    else if (build.value == 'Minimum Pass Build') { alert('Met Minimum Requirements.'); }
    else { alert('Met Reccomended Requirements.'); }
}
