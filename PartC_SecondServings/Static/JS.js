const greetingInput = document.getElementById("greeting");
greetingInput.value = greeting();

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Good Morning!";
  } else if (hour < 16) {
    return "Good Afternoon!";
  } else if (hour < 21) {
    return "Good Evening!";
  } else {
    return "Good Night!";
  }
}


// Function to handle getting the user's location
function getLocation() {
    console.log("lets start");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }
  
// Function to handle displaying the city based on the user's location
function showPosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
  
    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)
    .then(response => response.json())
    .then(data => {
        const city = data.city;
        document.getElementById("city").value = city; // set the value of the input element with the city
    })
    .catch(error => {
    console.error('Error:', error);
    });
}






