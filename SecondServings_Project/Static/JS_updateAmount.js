const button_update = document.getElementById("button_update");


if (sessionStorage.getItem("isConnected") === "true") {
  fetch('MenuBar_User.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('menu').innerHTML = html;
    });
} else {
  fetch('MenuBar.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('menu').innerHTML = html;
    });
}



button_update.addEventListener("click", function() {
  if(sessionStorage.getItem("isConnected") === "true"){
    window.open("ApprovedUpdateAmount.html", "popup", "width=1000,height=700");
    window.location.href = "viewPost.html";
  }
  else
    window.location.href = "PleaseLogIn.html";
});

const button5 = document.getElementById("button5");
button5.addEventListener("click", function() {
  window.location.href = "viewPost.html";
});

import { Class_Post } from './Class_Post.js';

const post = new Class_Post(
  "Hamburger",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Hamburger_%28black_bg%29.jpg/1200px-Hamburger_%28black_bg%29.jpg",
  new Date(),
  "10:00",
  "12:00",
  "New York",
  "123 Main St",
  "052-8756432",
  "Yammy home-made hamburger!",
  10,
  ["Peanut-free", "Sugar-free"],
  ["not-kosher"],
  "no allergies"
);

document.getElementById("username").value = post.getTitle();
document.getElementById("address").value = post.getAddress() + " , " + post.getCity();

