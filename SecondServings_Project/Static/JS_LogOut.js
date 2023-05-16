const button_logout = document.getElementById("button_signUp2");
const button_cancel = document.getElementById("button_login2");

button_logout.addEventListener("click", function () {
  sessionStorage.setItem("isConnected", false);
  window.location.href = "HomePage.html";
});
button_cancel.addEventListener("click", function () {
  const lastPage = sessionStorage.getItem("lastPage");
  window.location.href = "HomePage_User.html";
});


