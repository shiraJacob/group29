


window.addEventListener("beforeunload", function () {
  sessionStorage.setItem("lastPage", window.location.href);
});

const button5 = document.getElementById("button5");
button5.addEventListener("click", function() {
  window.location.href = "YourProfile.html";
});


//until we will have database.. here an example for what it should look like :)

import { Class_Post } from './Class_Post.js';
import { Class_User } from './Class_User.js';

const button_viewPost = document.getElementById("button_viewPost");
button_viewPost.addEventListener("click", function() {
  window.location.href = "viewPost.html";
});
const button_viewPost2 = document.getElementById("button_viewPost2");
button_viewPost2.addEventListener("click", function() {
  window.location.href = "viewPost.html";
});
const button_viewPost3 = document.getElementById("button_viewPost3");
button_viewPost3.addEventListener("click", function() {
  window.location.href = "viewPost.html";
});




const user = new Class_User(
  "Noa Kirel",
  "password123",
  "555-555-5555",
  "123 Main St, Anytown USA",
  ["Vegetarian", "Gluten-free"],
  true,
  false,
  "Tel Aviv"
);

const post = new Class_Post(
  "Gnocchi",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Hamburger_%28black_bg%29.jpg/1200px-Hamburger_%28black_bg%29.jpg",
  new Date(),
  "10:00",
  "12:00",
  "New York",
  "123 Main St",
  "052-8756432",
  "This is a random post.",
  10,
  ["Vegetarian", "Vegan"],
  ["not-kosher"],
  "no allergies"
);
post.addToEnjoyed(4);


const post2 = new Class_Post(
  "Hamburger",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Supreme_pizza.jpg/1200px-Supreme_pizza.jpg",
  new Date(),
  "12:00",
  "14:00",
  "Los Angeles",
  "456 Oak St",
  "052-1234567",
  "This is another random post.",
  20,
  ["Vegetarian"],
  ["kosher"],
  "no allergies"
);
post2.addToEnjoyed(2);


const post3 = new Class_Post(
  "Pasta",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Sushi_platter.jpg/1200px-Sushi_platter.jpg",
  new Date(),
  "18:00",
  "20:00",
  "Tokyo",
  "789 Maple Ave",
  "052-9876543",
  "This is yet another random post.",
  30,
  ["Vegan"],
  ["not-kosher"],
  "no allergies"
);


document.getElementById("username").value = user.getUserName();

document.getElementById("title1").value = post.getTitle();
document.getElementById("title2").value = post2.getTitle();
document.getElementById("title3").value = post3.getTitle();
//document.getElementById("picture_url").value = post.getURL();
document.getElementById("expiration_date1").value = post.getExpiration().toLocaleDateString();
document.getElementById("enjoyedYourFood_number1").value = post.getEnjoyed();
document.getElementById("expiration_date2").value = post2.getExpiration().toLocaleDateString();
document.getElementById("enjoyedYourFood_number2").value = post2.getEnjoyed();
document.getElementById("expiration_date3").value = post3.getExpiration().toLocaleDateString();
document.getElementById("enjoyedYourFood_number3").value = post3.getEnjoyed();
