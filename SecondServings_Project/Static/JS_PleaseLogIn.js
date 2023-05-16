
const button_signUp2 = document.getElementById("button_signUp2");
const button_login2 = document.getElementById("button_login2");
const button5 = document.getElementById("button5");

button_signUp2.addEventListener("click", function() {
  window.location.href = "SignUp.html";
});
button_login2.addEventListener("click", function() {
  window.location.href = "log-in.html";
});
button5.addEventListener("click", function() {
  //take me to the the relevant page!!!!//

  //if after select pickup -> view post
  //if after post your food -> post your food
  const lastPage = sessionStorage.getItem("lastPage");
    window.location.href = lastPage;
});

