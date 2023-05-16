let validSignUp = false;
let validPhoneNumber;
let validUserName;
let validPassword;
let validAddress;
let validCity;


import { Class_User } from './Class_User.js';

const form = document.querySelector('.container');
const phoneNumberInput = document.getElementById('PhoneNumber');
const addressInput = document.getElementById('Address');
const userNameInput = document.getElementById('UserName');
const passwordInput = document.getElementById('Password');
const restaurantInput = document.getElementsByName('restaurant')[0];
const kosherInputs = document.querySelectorAll('#checkboxes input[type="checkbox"]');
const preferencesInputs = document.querySelectorAll('#preferences input[type="checkbox"]');
const cityInput=document.getElementById('city');
const button_signUp = document.querySelector('#button_signUp');

const button5 = document.getElementById("button5");
button5.addEventListener("click", function () {
  window.location.href = "HomePage.html";
});


button_signUp.addEventListener("click", function (event) {
  checkSignupInput();

  if (validSignUp === true) {
    alert('Glad to have you here!')
    sessionStorage.setItem("isConnected", true);
    addNewUser();
    const twoLastPage = sessionStorage.getItem("2lastPage");
    window.location.href = twoLastPage;
  }
});

const togglePassword = document.querySelector('.toggle-password');
const password = document.querySelector('#Password');

togglePassword.addEventListener('click', function () {
  const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
  password.setAttribute('type', type);
  this.classList.toggle('fa-eye-slash');
});
function addNewUser(){
  const newUser= new Class_User(userNameInput.value,passwordInput.value, phoneNumberInput.value, addressInput.value, preferencesInputs.value,kosherInputs.value,restaurantInput.value, cityInput.value);
  //~~~ add to database :)
}

function checkSignupInput() {
  checkValidPhoneNumber();
  checkValidAddress();
  checkValidUserName();
  checkValidPassword();
  checkValidCity();
  if (validUserName && validPhoneNumber && validPassword && validAddress && validCity) {
    validSignUp = true;
    alert('Signed-up successfully');
  } else {
    validSignUp = false;
    alert('Oops! invalid input')
  }
}

function checkValidUserName() {
  if (userNameInput.value === "") {
    userNameInput.style.border = "0.2em solid red";
    validUserName = false;
  } else {
    userNameInput.style.border = "0.2em solid #984a32";
    validUserName = true;
  }
}

function checkValidAddress() {
  if (addressInput.value === "") {
    addressInput.style.border = "0.2em solid red";
    validAddress = false;
  } else {
    addressInput.style.border = "0.2em solid #984a32";
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
function checkValidPhoneNumber() {
  const regex = /^05\d{8}$/;
  if (!regex.test(phoneNumberInput.value)) {
    phoneNumberInput.style.border = "0.2em solid red";
    validPhoneNumber = false;
  } else {
    phoneNumberInput.style.border = "0.2em solid #984a32";
    validPhoneNumber = true;
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
