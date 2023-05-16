const button_editProfile = document.getElementById("button_editProfile");
const button_viewPickups = document.getElementById("button_viewPickups");
const button_viewSharing = document.getElementById("button_viewSharing");

button_editProfile.addEventListener("click", function() {
  window.location.href = "EditProfile.html";
});
button_viewPickups.addEventListener("click", function() {
  window.location.href = "YourPickups.html";
});
button_viewSharing.addEventListener("click", function() {
  window.location.href = "FoodYouShared.html";
});
const button5 = document.getElementById("button5");
button5.addEventListener("click", function() {
  window.location.href = "HomePage_User.html";
});



//until we will hava database --> example for real user :)

import { Class_User } from './Class_User.js';

// create a user object with some random values
const user = new Class_User(
  "Noa Kirel",
  "password123",
  "0524366539",
  "123 Main St",
  ["Vegetarian", "Gluten-free"],
  true,
  true,
  "Tel Aviv"
);

// retrieve the Views elements
const usernameElement = document.getElementById("username");
const foodSharingNumberElement = document.getElementById("foodSahring_number");
const pickupsNumberElement = document.getElementById("pickups_number");
const enjoyedYourFoodNumberElement = document.getElementById("enjoyedYourFood_number");
const locationElement = document.getElementById("profile_location");
const preferencesInputs = document.querySelectorAll('#preferences input[type="checkbox"]');


const diet = user.getDiet();
  for (const checkbox of preferencesInputs) {
    if (diet.includes(checkbox.name)) {
      checkbox.checked = true;
    } else {
      checkbox.checked = false;
    }
  }

// update the values of the Views elements with the user data
usernameElement.value = user.getUserName();
foodSharingNumberElement.value = user.getAmountShare();
pickupsNumberElement.value = user.getAmountPickup();
enjoyedYourFoodNumberElement.value = user.getEnjoyed();
locationElement.value = user.getAddress()+ " , " +user.getCity();
