var hour = new Date().getHours();

const button_share1 = document.getElementById("button_share1");
const button_pickup1 = document.getElementById("button_pickup1");
const button_profile = document.getElementById("button_login1");

document.getElementById("greeting").value = greeting();
function greeting() {
  if (hour < 12) {
    return "Good Morning!"
  } else if (hour < 16) {
    return "Good Afternoon!"
  } else if (hour < 21) {
    return "Good Evening!"
  } else {
    return "Good Night!"
  }
}

button_share1.addEventListener("click", function() {
  window.location.href = "postYourFood.html";
});
button_pickup1.addEventListener("click", function() {
  window.location.href = "Search.html";
});
button_profile.addEventListener("click", function() {
  window.location.href = "YourProfile.html";
});
