//Save Option Display
function saveOption() {
  const name = document.querySelector('#name');
  const cpu = document.querySelector('#cpu');
  const gpu = document.querySelector('#gpu');
  const ram = document.querySelector('#ram');
  const storage = document.querySelector('#storage');
  //output = selectElement.value;
  //document.querySelector('.output').textContent = output;

  //Update MyBuild
  document.querySelector('#myNAME').innerHTML = name.value;
  document.querySelector('#myCPU').innerHTML = "CPU: " + cpu.value;
  document.querySelector('#myGPU').innerHTML = "GPU: " + gpu.value;
  document.querySelector('#myRAM').innerHTML = "RAM: " + ram.value;
  document.querySelector('#mySTORAGE').innerHTML = "Storage: " + storage.value;

}

//JS Switch Between Tabs
function openType(evt, buildType) {
  let i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
  tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
  tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(buildType).style.display = "block";
  evt.currentTarget.className += " active";
}
