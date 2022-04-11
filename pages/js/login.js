//Get elements
const emailLogin = document.getElementById("emailLogin");
const passwordLogin = document.getElementById("passwordLogin");
const submitLogin = document.getElementById("submitLogin");
const emailSignUp = document.getElementById("emailSignUp");
const passwordSignUp = document.getElementById("passwordSignUp");
const verifySignUp = document.getElementById("passwordVerifySignUp");
const submitSignUp = document.getElementById("submitSignUp");

//Check for onclick
function loginClick(){
  //submitLogin.preventDefault(); //Stops normal behavior

  //Check login info
  const email = emailLogin.value;
  const pass = passwordLogin.value;

  //Verify
  let emailArray = ["admin@reqcheck.com", "user@reqcheck.com", "gamedev@reqcheck.com"];
  let passArray = [1234, 1234, 1234];
  let emailConfirm = false;
  let passConfirm = false;
  for (let i = 0; i < emailArray.length; i++)
  {
    if (emailArray[i] == email)
    {
      emailConfirm = true;
    }

    if (passArray[i] == pass)
    {
      passConfirm = true;
      if (emailConfirm) break;
    }
  }

  if (passConfirm){
    alert("Login Successful!");
    if (email == "user@reqcheck.com") location.assign('../index.html');
    else if (email == "admin@reqcheck.com") location.assign('admin.html');
    else if (email == "gamedev@reqcheck.com") location.assign('dev.html');

  }
  else alert("Login Failed, please try again.");

}

function signUpClick(){
  const email = emailSignUp.value;
  const pass = passwordSignUp.value;
  const passVerfiy = passwordVerifySignUp.value;

  //Sign up
  if (email == "") alert("Please enter a valid email.");
  else if (pass == "") alert("Please enter a password.");
  else if (passVerfiy == "") alert("Please re-enter your password.");
  else {
    if (pass == passVerfiy)
    {
      alert("Sign-Up Successful!");
      location.assign('../index.html');
    }
    else alert("Passwords do not match. Please try again.");
  }
}
