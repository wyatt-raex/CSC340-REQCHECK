//Varaibles
const noSupport = "Selected Build's Operating System is not offically supported by this game.";
const noRequirements = "Though the selected build's Operating System is supported for this game, there are no requirements listed by the developer.";

window.onload = function(){
  getJSON();
}

//Get ID
function getID() {
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

    //Requirements
    sessionStorage.setItem('windowsSupport', data[id].data.platforms.windows);
    sessionStorage.setItem('windowsMinimum', data[id].data.pc_requirements.minimum);
    sessionStorage.setItem('windowsRecommended', data[id].data.pc_requirements.recommended);
    sessionStorage.setItem('macSupport', data[id].data.platforms.mac);
    sessionStorage.setItem('macMinimum', data[id].data.mac_requirements.minimum);
    sessionStorage.setItem('macRecommended', data[id].data.mac_requirements.recommended);
    sessionStorage.setItem('linuxSupport', data[id].data.platforms.linux);
    sessionStorage.setItem('linuxMinimum', data[id].data.linux_requirements.minimum);
    sessionStorage.setItem('linuxRecommended', data[id].data.linux_requirements.recommended);

    //Display JSON
    document.getElementById("titleName").innerHTML = 'ReqCheck - ' + name;
    document.getElementById("gameName").innerHTML = name;
    document.getElementById("gameImage").src = image;
    document.getElementById("gameDescription").innerHTML = description;
    checkOS();
  });
}

//Check OS Support
function checkOS() {
  //Get Requirements
  const windowsSupport = sessionStorage.getItem('windowsSupport') === 'true';
  const windowsMinimum = sessionStorage.getItem('windowsMinimum');
  const windowsRecommended = sessionStorage.getItem('windowsRecommended');
  const macSupport = sessionStorage.getItem('macSupport') === 'true';
  const macMinimum = sessionStorage.getItem('macMinimum');
  const macRecommended = sessionStorage.getItem('macRecommended');
  const linuxSupport = sessionStorage.getItem('linuxSupport') === 'true';
  const linuxMinimum = sessionStorage.getItem('linuxMinimum');
  const linuxRecommended = sessionStorage.getItem('linuxRecommended');

  //Display Requirement Based on Selected Build OS
  let osSupport = true;
  let minRequirement = '';
  let recRequirement = '';

  //Select based on current system
  let systemType = ''; //CHANGE THIS TO DOM GETTING CURRENT SELECTED BUILD OS
  const build = document.querySelector('#build');
  if (build.value == 'Failure Build') systemType = 'windows';
  if (build.value == 'Minimum Pass Build') systemType = 'mac';
  if (build.value == 'Passing Build')  systemType = 'linux';
  switch (systemType)
  {
    case 'windows':
      minRequirement += windowsMinimum;
      recRequirement += windowsRecommended;
      osSupport = windowsSupport;
    break;

    case 'mac':
      minRequirement += macMinimum;
      recRequirement += macRecommended;
      osSupport = macSupport;
    break;

    case 'linux':
      minRequirement += linuxMinimum;
      recRequirement += linuxRecommended;
      osSupport = linuxSupport;
    break;
  }

  //Get current system
  let requirement = '';
  if (osSupport == false) requirement = noSupport;
  else{
    if (minRequirement != 'undefined') requirement += minRequirement;
    if (recRequirement != 'undefined') requirement += '<br>' + recRequirement;
    if (requirement == '') requirement = noRequirements;
  }
  
  document.getElementById("gameRequirements").innerHTML = requirement;
  return requirement;
}

//Compare
function compareOption() {
    //Get Requirements
    let requirement = checkOS().toUpperCase();
    //console.log(requirement);

    //Check for tiers
    const hasMin = requirement.indexOf("MINIMUM");
    const hasRec = requirement.indexOf("RECOMMENDED")
    const minString = requirement.substring(hasMin, hasRec);
    const recString = requirement.substring(hasRec);
    let sIndex = -1;
    let sLength = -1;

    if (requirement != noSupport && requirement != noRequirements) {
      //MINIMUM//
      const minimum = ['', '', '', ''] //CPU, RAM, GPU, STORAGE

      //If there are minimum requirements
      if (hasMin != -1) { 
        //Processor
        sIndex = minString.indexOf("<STRONG>PROCESSOR:</STRONG>");
        if (sIndex != -1) {
          sLength = ("<STRONG>PROCESSOR:</STRONG>").length;
          sIndex = sIndex+sLength+1;
          minimum[0] = minString.substring(sIndex, sIndex+(minString.substring(sIndex+1)).indexOf("<")+1);
          console.log(minimum[0]);
        }

        //Memory
        sIndex = minString.indexOf("<STRONG>MEMORY:</STRONG>");
        if (sIndex != -1) {
          sLength = ("<STRONG>MEMORY:</STRONG>").length;
          sIndex = sIndex+sLength+1;
          minimum[1] = minString.substring(sIndex, sIndex+(minString.substring(sIndex+1)).indexOf("<")+1);
          console.log(minimum[1]);
        }

        //Graphics
        sIndex = minString.indexOf("<STRONG>GRAPHICS:</STRONG>");
        if (sIndex != -1) {
          sLength = ("<STRONG>GRAPHICS:</STRONG>").length;
          sIndex = sIndex+sLength+1;
          minimum[2] = minString.substring(sIndex, sIndex+(minString.substring(sIndex+1)).indexOf("<")+1);
          console.log(minimum[2]);
        }

        //Storage
        sIndex = minString.indexOf("<STRONG>STORAGE:</STRONG>");
        if (sIndex != -1) {
          sLength = ("<STRONG>STORAGE:</STRONG>").length;
          sIndex = sIndex+sLength+1;
          minimum[3] = minString.substring(sIndex, sIndex+(minString.substring(sIndex+1)).indexOf("<")+1);
          console.log(minimum[3]);
        }
      }

      //RECOMMENDED//
      const recommended = ['', '', '', ''] //CPU, RAM, GPU, STORAGE

      //If there are recommended requirements
      if (hasMin != -1) { 
        //Processor
        sIndex = recString.indexOf("<STRONG>PROCESSOR:</STRONG>");
        if (sIndex != -1) {
          sLength = ("<STRONG>PROCESSOR:</STRONG>").length;
          sIndex = sIndex+sLength+1;
          recommended[0] = recString.substring(sIndex, sIndex+(recString.substring(sIndex+1)).indexOf("<")+1);
          console.log(recommended[0]);
        }

        //Memory
        sIndex = recString.indexOf("<STRONG>MEMORY:</STRONG>");
        if (sIndex != -1) {
          sLength = ("<STRONG>MEMORY:</STRONG>").length;
          sIndex = sIndex+sLength+1;
          recommended[1] = recString.substring(sIndex, sIndex+(recString.substring(sIndex+1)).indexOf("<")+1);
          console.log(recommended[1]);
        }

        //Graphics
        sIndex = recString.indexOf("<STRONG>GRAPHICS:</STRONG>");
        if (sIndex != -1) {
          sLength = ("<STRONG>GRAPHICS:</STRONG>").length;
          sIndex = sIndex+sLength+1;
          recommended[2] = recString.substring(sIndex, sIndex+(recString.substring(sIndex+1)).indexOf("<")+1);
          console.log(recommended[2]);
        }

        //Storage
        sIndex = recString.indexOf("<STRONG>STORAGE:</STRONG>");
        if (sIndex != -1) {
          sLength = ("<STRONG>STORAGE:</STRONG>").length;
          sIndex = sIndex+sLength+1;
          recommended[3] = recString.substring(sIndex, sIndex+(recString.substring(sIndex+1)).indexOf("<")+1);
          console.log(recommended[3]);
        }
      }
    }


    

  

    
    
}
