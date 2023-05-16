let validSignUp = false;
let validPhoneNumber;
let validPassword;
let validAddress;
let validCity;

//until we will hava database --> example for real user :)

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

const usernameInput = document.getElementById('username');
const phoneNumberInput = document.getElementById('PhoneNumber');
const addressInput = document.getElementById('Address');
const passwordInput = document.getElementById('Password');
const restaurantInput = document.getElementsByName('restaurant')[0];
const kosherInputs = document.querySelectorAll('#checkboxes input[type="checkbox"]');
const preferencesInputs = document.querySelectorAll('#preferences input[type="checkbox"]');
const cityInput = document.getElementById('city');

const button_save = document.getElementById('button_save');

const button5 = document.getElementById('button5');
button5.addEventListener('click', function () {
  window.location.href = 'YourProfile.html';
});

const togglePassword = document.querySelector('.toggle-password');
const password = document.querySelector('#Password');

togglePassword.addEventListener('click', function () {
  const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
  password.setAttribute('type', type);
  this.classList.toggle('fa-eye-slash');
});

// Set input values from user
populateFormWithUserPreferences();

function populateFormWithUserPreferences() {
  usernameInput.value = user.userName;
  phoneNumberInput.value = user.phoneNumber;
  addressInput.value = user.address;
  passwordInput.value = user.password;
  cityInput.value = user.city;
  if (user.restaurantOwner) {
    restaurantInput.checked = true;
  } else {
    restaurantInput.checked = false;
  }

  const diet = user.getDiet();
  for (const checkbox of preferencesInputs) {
    if (diet.includes(checkbox.name)) {
      checkbox.checked = true;
    } else {
      checkbox.checked = false;
    }
  }
}

// Add event listener to update user object
button_save.addEventListener('click', function () {
  if (checkValidInput()) {
    user.phone = phoneNumberInput.value;
    user.address = addressInput.value;
    user.password = passwordInput.value;
    user.city = cityInput.value;
    alert('Profile updated successfully');
    window.location.href = "YourProfile.html";
  } else {
    alert('Oops! invalid input');
  }
});

function checkValidInput() {
  checkValidPhoneNumber();
  checkValidAddress();
  checkValidPassword();
  checkValidCity();
  if (validPhoneNumber && validPassword && validAddress && validCity) {
    validSignUp = true;
    return true;
  } else {
    validSignUp = false;
    return false;
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

function checkValidPassword() {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,12}$/;
  if (!regex.test(passwordInput.value)) {
    passwordInput.style.border = "0.2em solid red";
    validPassword = false;
  } else {
    passwordInput.style.border = "0.2em solid #984a32";
    validPassword = true;
  }
}
