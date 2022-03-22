//Load
function load(evt) {
  openGame(evt);
  openHardware(evt);
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
