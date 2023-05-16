let validInput = false;
let validPhoneNumber;
let validTitle;
let validAddress;
let validCity;

import {Class_Post} from './Class_Post.js';




const button_share = document.getElementById("button_share");
const phoneNumberInput = document.getElementById('Phone');
const addressInput = document.getElementById('pickup');
const titleInput = document.getElementById('title');
const quantityInput = document.getElementById('quantity');
const cityInput = document.getElementById('city');
const expirationInput = document.getElementById('expiry_date');
const descriptionInput = document.getElementById('description');
const pickup_hours_fromInput =document.getElementById('pickup_hours_from');
const pickup_hours_toInput =document.getElementById('pickup_hours_to');
const ingredientsInput =document.getElementById('ingredients');
const kosherInputs = document.querySelectorAll('#checkboxes input[type="checkbox"]');
const preferencesInputs = document.querySelectorAll('#preferences input[type="checkbox"]');

const fileInput = document.getElementById('picture');
const fileSpan = document.querySelector('.file-span');
const imageInput = document.getElementById('picture');

fileInput.addEventListener('change', function() {
  const file = this.files[0];
  const fileType = file.type;
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

  if (validImageTypes.includes(fileType)) {
    const reader = new FileReader();
    reader.addEventListener('load', function() {
      fileSpan.style.backgroundImage = `url(${reader.result})`;
      imageInput.value = reader.result;
    });

    reader.readAsDataURL(file);
  } else {
    alert('Please upload a valid image file.');
  }
});

const button5 = document.getElementById("button5");

button5.addEventListener("click", function () {
  if (sessionStorage.getItem("isConnected") === "true") {
    window.location.href = "HomePage_User.html";
  } else {
    window.location.href = "HomePage.html";
  }
});



button_share.addEventListener("click", function (event) {
  if(sessionStorage.getItem("isConnected") === "true") {
    checkValidInput();
    if (validInput) {
      addNewPost();
      alert('Post shared successfully');
      window.location.href = "viewPost.html";
    } else if (!validInput) {
      alert('Oops! invalid input');
    }
  }
  else  {
    window.location.href = "PleaseLogIn.html";
  }
});

import {Class_User} from './Class_User.js';

const user = new Class_User(
  "Noa Kirel",
  "password123",
  "0524366539",
  "123 Main St, Anytown USA",
  ["Vegetarian", "Gluten-free"],
  true,
  true,
  "Tel Aviv"
);
function addNewPost(){
  const post= new Class_Post(
    titleInput.value,
    imageInput.value,
    expirationInput.value,
    pickup_hours_fromInput.value,
    pickup_hours_toInput.value,
    cityInput.value,
    addressInput.value,
    phoneNumberInput.value,
    descriptionInput.value,
    quantityInput.value,
    preferencesInputs.value,
    kosherInputs.value,
    ingredientsInput.value,
    user.userName.value
  );
  //~~add to database
}
function checkValidInput() {
  checkValidPhoneNumber();
  checkValidAddress();
  checkValidTitle();
  checkValidCity();
  if (validPhoneNumber && validTitle && validAddress && validCity) {
    validInput = true;
  } else {
    validInput = false;
  }
}

function checkValidTitle() {
  if (titleInput.value === '') {
    titleInput.style.border = '0.2em solid red';
    validTitle = false;
  } else {
    titleInput.style.border = '0.2em solid #984a32';
    validTitle = true;
  }
}
function checkValidPhoneNumber() {
  const phoneNumberRegex = /^05\d{8}$/;
  if (phoneNumberRegex.test(phoneNumberInput.value)) {
    phoneNumberInput.style.border = '0.2em solid #984a32';
    validPhoneNumber = true;
  } else {
    phoneNumberInput.style.border = '0.2em solid red';
    validPhoneNumber = false;
  }
}
function checkValidAddress() {
  if (addressInput.value === '') {
    addressInput.style.border = '0.2em solid red';
    validAddress = false;
  } else {
    addressInput.style.border = '0.2em solid #984a32';
    validAddress = true;
  }
}

function checkValidCity() {
  if (cityInput.value === "") {
    cityInput.style.border = '0.2em solid red';
    validCity = false;
  } else {
    cityInput.style.border = '0.2em solid #984a32';
    validCity = true;
  }
}

function setMenu() {
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
}

window.addEventListener("beforeunload", function () {
  sessionStorage.setItem("lastPage", window.location.href);
});
window.addEventListener("beforeunload", function () {
  sessionStorage.setItem("2lastPage", window.location.href);
});

setMenu();
