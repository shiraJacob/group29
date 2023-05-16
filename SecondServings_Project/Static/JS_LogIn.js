let validLogin = true;

const button_login = document.getElementById("button_login");
const button8 = document.getElementById("button8");
const button5 = document.getElementById("button5");

button_login.addEventListener("click", function () {
  //1: search -> view post -> please login -> login -> view post
  //2: after post your food -> please login -> login -> post your food

  if (validLogin === true) { //after home page
    sessionStorage.setItem("isConnected", true);
    const twoLastPage = sessionStorage.getItem("2lastPage");
    window.location.href = twoLastPage;
  } else {
    window.location.href = "PleaseLogIn.html"; //!!!change massage!!!
  }

});


  const togglePassword = document.querySelector('.toggle-password');
  const password = document.querySelector('#Password');

  togglePassword.addEventListener('click', function () {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
  });



button8.addEventListener("click", function () {
  window.location.href = "SignUp.html";
});

button5.addEventListener("click", function () {
  window.location.href = "HomePage.html";
});
