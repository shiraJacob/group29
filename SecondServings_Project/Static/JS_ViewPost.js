let userConnected = false;

import {Class_pickUp} from './Class_pickUp.js';

const amountToPickUpInput = document.getElementById('amount');

function addNewPickUp() {
  const pickUp = new Class_pickUp(
    new Date(),
    amountToPickUpInput.value,
    user.userName,
    post
  );
  console.log(amountToPickUpInput.value);


}

import {Class_User} from './Class_User.js';

const user = new Class_User(
  "Zvi Aron",
  "password123",
  "0524366539",
  "123 Main St, Anytown USA",
  ["Vegetarian", "Gluten-free"],
  true,
  true,
  "Tel Aviv"
);


const button_updateAmount = document.getElementById("button_updateAmount");
const button_selectPickup = document.getElementById("button_selectPickup");


import {Class_Post} from './Class_Post.js';

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

// Fill the viewonly inputs with the post's values
document.getElementById("title_view").value = post.getTitle();
//document.getElementById("picture_url").value = post.getURL();
document.getElementById("expiration_date").value = post.getExpiration().toLocaleDateString();
document.getElementById("pickup_hours-date").value = `${post.getFrom()} - ${post.getTo()}`;
document.getElementById("address").value = post.getAddress() + " , " + post.getCity();
document.getElementById("phone_number").value = post.getPhoneNumber();
document.getElementById("description").value = post.getDescription();
document.getElementById("amountAvailable").value = post.getAmountAvailable();
document.getElementById("allergies").value = post.getAllergies();


// Check the diet checkboxes based on post's values
const diet = document.querySelectorAll("#diet input[type=checkbox]");
for (const checkbox of diet) {
  checkbox.checked = post.getDiet().includes(checkbox.name);
}

// Check the kosher checkboxes based on post's values
const kosher = document.querySelectorAll("#kosher input[type=checkbox]");
for (const checkbox of kosher) {
  checkbox.checked = post.getKosher().includes(checkbox.name);
}


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

button_updateAmount.addEventListener("click", function () {
  window.location.href = "UpdateAmount.html";
});

button_selectPickup.addEventListener("click", function () {
  if (sessionStorage.getItem("isConnected") === "true") {
    addNewPickUp();
    window.open("ApprovedPickup.html", "popup", "width=1000,height=700");
  } else {
    window.location.href = "PleaseLogIn.html";
  }
});

const button5 = document.getElementById("button5");
button5.addEventListener("click", function () {
  // Retrieve the last page URL from sessionStorage and navigate to it
  const lastPage = sessionStorage.getItem("lastPage");
  if (lastPage === window.location.href)
    window.location.href = "Search.html";
  else
    window.location.href = lastPage;

});

window.addEventListener("beforeunload", function () {
  sessionStorage.setItem("2lastPage", window.location.href);
});

window.addEventListener("beforeunload", function () {
  sessionStorage.setItem("lastPage", window.location.href);
});
