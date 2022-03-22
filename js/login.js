//Get elements
const emailLogin = document.getElementById("emailLogin");
const passwordLogin = document.getElementById("passwordLogin");
const submitLogin = document.getElementById("submitLogin");
const emailSignUp = document.getElementById("emailSignUp");
const passwordSignUp = document.getElementById("passwordSignUp");
const submitSignUp = document.getElementById("submitSignUp");

//Check for onclick
function loginClick(){
  //submitLogin.preventDefault(); //Stops normal behavior

  //Check login info
  const email = emailLogin.value;
  const pass = passwordLogin.value;
  if (email === "test@test.com" && pass === "1234"){
    alert("Login Successful!");
    location.assign('../index.html');
  }
  else alert("Login Failed, please try again.");

}

function signUpClick(){
  const email = emailSignUp.value;
  const pass = passwordSignUp.value;
  if (email != "" && pass != ""){
    alert("Sign-Up Successful!");
    location.assign('../index.html');
  }
  else alert("Please populate all fields and try again.");
}
