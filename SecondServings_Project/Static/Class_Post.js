export class Class_Post {
  static ID = 0;

  constructor(title, pictureURL, expiration, from, to, city, address, phoneNumber, description, amountAvailable, diet, kosher, allergies, username) {
    this.ID = Class_Post.ID++;
    this.title = title
    this.pictureURL = pictureURL
    this.expiration = new Date(expiration)
    this.hourFrom = from
    this.hourTo = to
    this.phoneNumber = phoneNumber
    this.city = city
    this.address = address
    this.description = description
    this.amountAvailable = amountAvailable //needs update function
    this.diet = diet //new vector?
    this.kosher = kosher //vector?
    this.postDate = new Date();
    this.allergies = allergies;
    this.peopleEnjoyed=0;
    this.userName=username;
  }

  getID() {
    return this.ID
  }
  getTitle() {
    return this.title
  }

  getURL() {
    return this.pictureURL
  }

  getExpiration() {
    return this.expiration
  }

  getFrom() {
    return this.hourFrom
  }

  getTo() {
    return this.hourTo
  }

  getDiet() {
    return this.diet
  }

  getKosher() {
    return this.kosher
  }

  getCity() {
    return this.city
  }

  getAddress() {
    return this.address
  }

  getPhoneNumber() {
    return this.phoneNumber
  }

  getAddress() {
    return this.address
  }

  getDescription() {
    return this.description
  }

  getAmountAvailable() {
    return this.amountAvailable
  }
  getAllergies(){
    return this.allergies;
  }

  getEnjoyed(){
    return this.peopleEnjoyed;
  }

  addToEnjoyed(amount){
    this.peopleEnjoyed+=amount;
  }

  getUserName(){
    return this.userName;
  }

}
