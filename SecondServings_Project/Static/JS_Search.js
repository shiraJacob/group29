const button5 = document.getElementById("button5");
const button_location = document.getElementById("button_location");
const button_filter = document.getElementById("button_filter");
const button_clearFilter = document.getElementById("button_clearFilter");
const selectedOptions = [];
let searchResults = document.querySelector("#search_results");

const citySelect = document.getElementById("city_select");
const cityInput = document.getElementById("city");
const kosherSelect = document.getElementById("kosher");
const preferencesSearch = document.getElementById("preferences_search");





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


button5.addEventListener("click", function () {
  if (sessionStorage.getItem("isConnected") === "true")
    window.location.href = "HomePage_User.html";
  else
    window.location.href = "HomePage.html";
});
button_location.addEventListener("click", function () {
  getLocation();
});
button_filter.addEventListener("click", function () {
  alert("search button will work when we will have database :)");
  //when we will have database-> this will filter the posts
});
button_clearFilter.addEventListener("click", function() {
  citySelect.value = "";
  cityInput.value = "";
  kosherSelect.value = "";
  cityInput.style.borderColor = "#984a32";
  citySelect.style.borderColor = "#984a32";
  const checkboxes = preferencesSearch.querySelectorAll("input[type='checkbox']");
  checkboxes.forEach(checkbox => checkbox.checked = false);
});


citySelect.addEventListener("change", () => {
  if (citySelect.value!="") {
    cityInput.value = "";
    citySelect.style.borderColor = "#984a32";
    cityInput.style.borderColor = "#B8B8B8";
  }
});


//button with the food title will take us to view post//
window.addEventListener("beforeunload", function () {
  sessionStorage.setItem("lastPage", window.location.href);
});

const images = document.querySelectorAll(".row_images img");

for (let i = 0; i < images.length; i++) {
  images[i].addEventListener("click", function () {
    window.location.href = "viewPost.html";
  });
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
    citySelect.value = "";
    citySelect.style.borderColor = "#B8B8B8";
    cityInput.style.borderColor = "#984a32";
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;

  fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)
    .then(response => response.json())
    .then(data => {
      const city = data.city;
      document.getElementById("city").value = city; // set the value of the input element with the city
      select.value = city; // set the selected option of the select element
    })
    .catch(error => console.log(error));
}
